const fs = require('fs');
const path = require('path');
const url = require('url');
const moment = require('moment');
const SMSClient = require('@alicloud/sms-sdk');
const Chance = require('chance');
const URLSearchParams = url.URLSearchParams;

const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;


// 检查是否可以发送短信
const SMS_CODE_IS_OK = `
    -- KEYS[1]: 键前缀
    -- ARGV[1]: 手机号
    -- ARGV[2]: 校验码
    -- ARGV[3]: 当前日期
    -- ARGV[4]: 校验码有效期
    -- ARGV[5]: 倒计时有效期
    -- ARGV[6]: 每天最大发送次数限制

    local KEY_PRE = KEYS[1]
    local TTL_KEY = KEY_PRE .. ":TTL"
    local VAL_KEY = KEY_PRE .. ":" .. ARGV[1]
    local CNT_KEY = KEY_PRE .. ":COUNT:" .. ARGV[3]

    local VAL_VAL = ARGV[2]
    local VAL_TTL = ARGV[4] or 900
    local TTL_TTL = ARGV[5] or 60
    local MAX_THRESHOLD_OF_DAY = ARGV[6] or 500

    -- 倒计时
    if (tonumber(redis.call('exists', TTL_KEY)) ~= 0) then
        return 'ttl'
    end

    -- 每天最大发送次数限制
    if (tonumber(redis.call('get', CNT_KEY) or 0) >= MAX_THRESHOLD_OF_DAY) then
        return 'threshold'
    else
        redis.call('incr', CNT_KEY)
        redis.call('expire', CNT_KEY, 86400)
    end

    -- 存倒计时
    redis.call('setex', TTL_KEY, TTL_TTL, 1)

    -- 存校验码
    return redis.call('setex', VAL_KEY, VAL_TTL, VAL_VAL)
`;



module.exports = app => {
    const conf = app.config;
    const model = app.model;
    const redis = app.redis;

    function isFileExist(){
        let curDate = new Date();
        let year = curDate.getFullYear();
        let month = curDate.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        let day = curDate.getDate();
        day = day < 10 ? '0' + day : day;
        let rootFileDir = `${year}${month}${day}`;
        let wholePath = path.join(conf.baseDir, 'app/public/upload', rootFileDir);

        return new Promise((resolve, reject)=>{
            fs.exists(wholePath, function(exists){
                if(exists){
                    resolve({rootFileDir, wholePath});
                }else{
                    fs.mkdirSync(wholePath);
                    resolve({rootFileDir, wholePath});
                }
            })
        })
    }

    function readdir(dir) {
        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(files);
            })
        }).then(files => {
            let names = new Map;
            files.forEach(file => {
                let ext = path.extname(file)
                let base = path.basename(file, ext);
                names.set(base, base);
            });
            return names.values();
        });
    }

    // 是否可以发送短信
    redis.defineCommand("isOK", {
        numberOfKeys: 1,
        lua: SMS_CODE_IS_OK
    });

    // 模板全局变量
    app.locals = {
        "__CDN__": conf.cdnVersion,
        "__MIN__": '.min',
        "__BOOK_INDEX__": conf.bookIndex,
        "__FILM_INDEX__": conf.filmIndex
    };

    class Home extends app.Controller {
        async login(ctx) {
            /*try {
                ctx.validate({
                    "gw_address": {
                        type: 'string',
                        format: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
                    },
                    "gw_port": 'id',
                }, ctx.query);
            } catch (err) {
                ctx.logger.error(err);
                // 非法输入返回`404`
                return;
            }*/

            // 请求参数:
            // -------------------------------------
            // {
            //     gw_id: '58696CEDEF10',
            //     gw_sn: 'HMAPA04170500534',
            //     gw_address: '192.168.255.1',
            //     gw_port: '2060',
            //     url: 'http://3gimg.qq.com/qq_product_operations/nettest/index.html?r=1739841954',
            //     ip: '192.168.0.61',
            //     mac: '8c:85:90:15:c7:f3',
            //     apmac: '5869.6ced.ef10',
            //     ssid: 'MTFi-M1'
            // }
            // -------------------------------------
            let {
                gw_id, gw_sn, gw_address, gw_port,
                url,
                ip, mac,
                apmac, ssid
            } = ctx.query;

            // 获取`WIFI终端`信息
            let [ sta ] = await model.Sta.updateByMAC(mac, ip, gw_id, gw_sn);
            let query = new URLSearchParams(ctx.query).toString();

            // 未绑定手机
            if (!sta.username) {
                return await ctx.render('home/signup', {
                    "action": `/signup?${query}`,
                    "sendcode": `/smscode?${query}`
                });
            }

            // 更新`MTFi设备`信息
            // *** 临时方案: 设备信息应该是静态存储的 ***
            await model.Mtfi.findAndUpdate(ctx.query);

            // 跳转`Portal`页
            ctx.redirect(`/wifi/portal?${query}`);
        }

        async signup(ctx) {
            let { mobile, code } = ctx.request.body;
            let { mac } = ctx.query;

            try {
                ctx.validate({
                    "code": {
                        type: 'string',
                        max: 6
                    }
                });
            } catch (err) {
                ctx.status = 400;
                ctx.body = {
                    "message": "输入错误"
                };
                return;
            }

            let key = `SMS:${mac}:${mobile}`;
            let val = await redis.get(key);

            if (val !== code) {
                ctx.status = 400;
                ctx.body = {
                    "message": "验证码输入错误或已失效"
                };
                return;
            }

            try {
                await model.Sta.authMobile(mac, mobile);
            } catch (err) {
                ctx.logger.error(err);

                ctx.status = 400;
                ctx.body = {
                    "message": "认证出错，请稍候重试"
                };
                return;
            }

            ctx.body = {
                reload: true
            };
        }

        async smscode(ctx) {
            let { mobile } = ctx.request.body;
            let { mac } = ctx.query;

            let key = `SMS:${mac}`;
            let ttl = `${key}:TTL`;
            let day = moment().date();
            let code = new Chance().string({
                length: 6,
                pool: "0123456789"
            });
            console.log(code);
            // 校验是否可以发送短信
            let isOK = await redis.isOK(key, mobile, code, day);
            if (isOK === 'ttl') {
                ctx.status = 400;
                ctx.body = {
                    ttl: await redis.ttl(ttl)
                };
                return;
            }
            else if (isOK === 'threshold') {
                ctx.status = 400;
                ctx.body = {
                    message: "请求次数超限"
                };
                return;
            }

            ctx.logger.debug('sms code: %s', code);

            // 发送短信
            const client = new SMSClient(conf);
            let result = 'OK';

            if (conf.env === 'prod') {
                result = await client.sendSMS({
                    "PhoneNumbers":   mobile,
                    "SignName":       conf.signName,
                    "TemplateCode":   conf.templateCode,
                    "TemplateParam":  `{"code":"${code}"}`
                }).then(({ Code, Message }) => {
                    if (Code === 'OK') {
                        return Code;
                    }

                    return Promise.reject({
                        message: Message
                    });
                }).catch(err => {
                    ctx.logger.error(err);
                    // 短信发送失败重置短信防火墙
                    return Promise.all([
                        redis.del(ttl),
                        redis.decr(`${key}:COUNT:${day}`)
                    ]).catch(err => {
                        ctx.logger.error(err.message);
                    }).then(() => "发送短信出错");
                });
            }

            if (result === 'OK') {
                ctx.body = {
                    ttl: await redis.ttl(ttl)
                };
                return;
            }

            ctx.status = 400;
            ctx.body = {
                message: result
            };
        }

        async auth(ctx) {
            try {
                ctx.validate({
                    "stage": [ 'login', 'logout', 'counters', 'query' ],
                }, ctx.query);

                // 查询终端认证状态
                // 没有流量信息参数
                if (ctx.query.stage !== 'query') {

                    ctx.validate({
                        "incoming": /\d+/,
                        "outgoing": /\d+/
                    }, ctx.query);

                    // 统计流量
                    let uuidv4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
                    let isToken = uuidv4.test(ctx.query.token);

                    if (isToken) {
                        model.Counters.userTrace(ctx.query).catch(err => {
                            ctx.logger.error('counters: %o', err);
                        });
                    }
                }
            } catch(err) {
                // 非法输入返回`404`
                return;
            }

            let { gw_id, mac, token, stage } = ctx.query;
            ctx.logger.debug('ctx.query: %s', ctx.query);

            // 退出登录
            if (stage === 'logout') {
                ctx.body = await model.Token.offline(gw_id, mac).then(() => "logout");
                return;
            }

            // 用户登录
            if (stage === 'login') {
                // 充值
                let balance = await model.Order.balance(mac, 'FLOW');
                // 流量是否超限
                let flow = await model.Counters.remains(mac).then(f => f.plus(balance));

                if (flow.isNegative()) {
                    ctx.body = { auth: 0 };
                    return;
                }

                ctx.body = await model.Token.online(gw_id, mac);
            }

            // 用户追踪
            if (stage === 'counters') {
                // 充值
                let balance = await model.Order.balance(mac, 'FLOW');
                // 流量是否超限
                let flow = await model.Counters.remains(mac).then(f => f.plus(balance));

                if (flow.isNegative()) {
                    await model.Token.offline(gw_id, mac);
                    ctx.body = 'Auth: 0';
                    return;
                }

                ctx.body = await model.Token.findByToken(gw_id, token);
            }
        }

        async index(ctx) {
            let { gw_id, gw_sn, mac, wifi } = ctx.query;
            let [ gw_address, gw_port, ip, username ] = await Promise.all([
                model.Mtfi.findByGW(gw_id, gw_sn),
                model.Sta.findByMAC(mac)
            ]).then(([ mtfi, user ]) => {
                return mtfi && user ? [
                    mtfi.gw_address,
                    mtfi.gw_port,
                    user.ip,
                    user.username
                ] : [];
            }).catch(err => {
                ctx.logger.error(err);
                return [];
            });
            

            // 非法请求
            if (!gw_address || !username) {
                return;
            }

            // 获取终端`token`
            let [ token ] = await model.Token.findByLock(
                gw_id,
                gw_sn,
                ip,
                mac,
                username
            );

            // 非法请求
            if (!token) {
                return;
            }

            // 统计信息
            let [ users, flow, timeout ] = await Promise.all([
                // 当前在线用户数
                model.Token.countByOnline(gw_id),
                // 终端流量统计
                model.Counters.flow(mac, username),
                // 用户跟踪超时(MTFi设备断电)
                model.Counters.timeout(token.token)
            ]);

            // MTFi设备断电`iptables`数据被清除
            // 发生状态不一致
            if (token.auth && timeout) {
                await model.Token.offline(gw_id, mac);
                ctx.redirect('http://192.168.0.1:2060/wifidog/redirect');
                return;
            }

            // 上线操作
            let online = `http://${gw_address}:${gw_port}/wifidog/auth?token=${token.token}`;
            // 下线操作
            let offline = `${online}&logout=1`;
            // wifi名称
            if(!wifi){
                wifi = "未知";
            }
            let wifiname = wifi;
            // 青藏铁路介绍
            let qzintro = conf.qzintroduce;
            
            /**
             * 3条新闻
             * 1 第一页
             * 3 3条数
             */
            let news = await ctx.service.news.lists(1, 3);
            // 3个电影 all 表示全部类型
            let films = await ctx.service.film.lists('all', 1, 3);
            // 3个小说
            let novels = await ctx.service.novel.lists('all', 1, 3);
            // 3个游戏
            let games = await ctx.service.game.lists('all', 1, 3);
            return await ctx.render('home/index', {
                mac: mac,
                status: token.auth,
                uname: token.username,
                online: online,
                offline: offline,
                wifiname: wifiname,
                users: users,
                flow: flow,
                qzintro: qzintro,
                news: news,
                films: films,
                novels: novels,
                games: games
            });
        }

        async message(ctx) {
            ctx.redirect('http://192.168.0.1:2060/wifidog/redirect');
        }

        async books(ctx) {
            // let tpl = await ctx.renderView('home/books', { books: conf.BOOK_LIST });
            // let file = path.join(app.baseDir, 'mediacenter/books.html');

            // await new Promise((resolve, reject) => {
            //     fs.writeFile(file, tpl, (err) => {
            //         if (err) {
            //             return reject(err);
            //         }
            //         resolve('ok');
            //     });
            // });
            // xh xz kb qg yq
            let type = ctx.params.type;
            
            return await ctx.render('home/books', { 
                type: type,
                books: conf.BOOK_LIST[type]
            });
        }

        async movies(ctx) {
            // let tpl = await ctx.renderView('home/movies', { films: conf.FILM_LIST });
            // let file = path.join(app.baseDir, 'mediacenter/movies.html');

            // await new Promise((resolve, reject) => {
            //     fs.writeFile(file, tpl, (err) => {
            //         if (err) {
            //             return reject(err);
            //         }
            //         resolve('ok');
            //     });
            // });

            // ctx.body = tpl;

            return await ctx.render('home/movies', { films: conf.FILM_LIST });
        }

       /* async player(ctx) {
            for (let key in conf.FILM_LIST) {
                let [ name, src ] = conf.FILM_LIST[key];
                let tpl = await ctx.renderView('home/player', { key: key, name: name, src: src });
                let file = path.join(app.baseDir, `mediacenter/player/${key}.html`);

                await new Promise((resolve, reject) => {
                    fs.writeFile(file, tpl, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve('ok');
                    });
                });
            }


            let key = ctx.params.name.replace('.html', '');
            let [ name, src ] = conf.FILM_LIST[key];
            return await ctx.render('home/player', { key: key, name: name, src: src });
        }*/

        // 播放电影
        async player(ctx) {
            let filmid = ctx.params.id;
            // 检测电影是否已经购买 todo
            //await ctx.service.myfilm.find

            let film = await ctx.service.film.getFileById(filmid);
            return await ctx.render('home/player', {film: film});
        }
        
        async adv(ctx) {
            ctx.body = {
                name: '广告名称',
                img: '/public/img/1.png',
                httpurl: 'https://www.baidu.com/'
            };
        }

        async mybooks(ctx) {
            return await ctx.render('home/mybooks');
        }

        async buy(ctx) {
            return await ctx.render('home/buy');
        }

        async tianluwifi(ctx){
            let mac = ctx.query.mac;
            let wifis = await ctx.service.wifi.lists();
            return await ctx.render('home/buy', {
                mac: mac,
                wifis: wifis
            });
        }
        
        async tianluwifibuy(ctx) {
            return await ctx.render('home/flowBuySuccess');
        }

        async mycenter(ctx) {
            let { mac } = ctx.query;
            let { username } = await model.Sta.findByMAC(mac);
            return await ctx.render('home/mycenter', {
                tel: username,
                mac: mac
            });
        }

        //type (novel,film,wifi)
        async alreadybuy(ctx) {
            let { mac } = ctx.query;
            if(!mac){
                return;
            }
            // 校验type
            let type = ctx.params.type;
            let data = [];
            if(type === 'novel') {
                data = await ctx.service.mynovel.lists(mac);
            }else if(type === 'film'){
                data = await ctx.service.myfilm.lists(mac);
            }else if(type === 'wifi'){
                // 查询购买的flow  todo
                //data = await ctx.service.mywifi.lists(mac);
                data = await ctx.service.mywifi.listsOrder(mac);
            }else{
                return;
            }

            return await ctx.render('home/myalreadybuy', {
                mac: mac,
                type: type,
                data: data
            });
        }

        async problem(ctx) {
            return await ctx.render('home/comProblems');
        }

        async advice(ctx) {
            return await ctx.render('home/problemFeedback');
        }
        // 小说阅读
        async novelReader(ctx) {
            return await ctx.render('home/novelReader');
        }

        
        // 上传图片
        async upload(ctx) {
           const parts = ctx.multipart({ autoFields: true });
           const files = [];
           let stream;
           while((stream = await parts()) != null){
               let index1 = stream.filename.lastIndexOf('.');
               let index2 = stream.filename.length;
               const fileSuffix = stream.filename.substring(index1, index2);
               const filename = Date.now()+fileSuffix;
               // 检测时间文件夹是否存在
               let {rootFileDir, wholePath} = await isFileExist();
               
               const target = path.join(wholePath, filename);
               const writeStream = fs.createWriteStream(target);
               try{
                   await awaitWriteStream(stream.pipe(writeStream));
               }catch(err){
                    await sendToWormhole(stream);
                    throw err;
               }
               files.push(path.join(rootFileDir, filename));
           }
            ctx.body = {
                //fields: Object.keys(parts.field).map( key => ({key, value: parts.field[key]})),
                path: files[0],
            };
        }
    }

    return Home;
};