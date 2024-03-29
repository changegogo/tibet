const fs = require('fs');
const path = require('path');
const url = require('url');
const moment = require('moment');
const SMSClient = require('@alicloud/sms-sdk');
const Chance = require('chance');
const URLSearchParams = url.URLSearchParams;

const sendToWormhole = require('stream-wormhole');
const awaitWriteStream = require('await-stream-ready').write;

const request = require('request');


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
    local MAX_THRESHOLD_OF_DAY = ARGV[6] or 20

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
                apmac, ssid,
                device
            } = ctx.query;

            
            // 更新并获取`WIFI终端`信息
            if(device != 'no') {
                await model.Sta.updateByMAC(mac, ip, gw_id, gw_sn);
                // 更新`MTFi设备`信息
                // *** 临时方案: 设备信息应该是静态存储的 ***
                await model.Mtfi.findAndUpdate(ctx.query);
            }
            let sta = await model.Sta.findByMAC(mac);
            Object.assign(ctx.query, {
                gw_id: sta.gw_id,
                gw_sn: sta.gw_sn,
                tag: ctx.query.tag == 'app' ? "app" : (sta.is_app ? "app" : "")
            });
            let query = new URLSearchParams(ctx.query).toString();
            // 未绑定手机
            if (!sta.username) {
                return await ctx.render('home/signup', {
                    "action": `/signup?${query}`,
                    "sendcode": `/smscode?${query}`
                });
            }else {
                // 跳转`Portal`页
                ctx.redirect(`/wifi/portal?${query}`);
            }
        }

        async signup(ctx) {
            let { mobile, code } = ctx.request.body;
            let { mac } = ctx.query;
            // 限制只能绑定一台设备
            let { username } = await model.Sta.findByMobile(mobile);
            if(username){
                ctx.status = 400;
                ctx.body = {
                    "message": "认证出错，您已绑定其它手机"
                };
                return;
            }

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
                        // 根据mac地址查询当前绑定的手机号码，流量记录中保存手机号码todo

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
                
                //console.log('LOGIN FLOW STATUS: ', flow);
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
            // MTFI回调服务器带来的query参数和app中主动添加的参数
            let { gw_id, gw_sn, mac, wifi, tag, device } = ctx.query;
            // 声明变量
            let gw_address, gw_port, ssid, ip, username, is_app;
            // 查询MTFI信息 gw_id 设备的MAC、gw_sn MTFi设备的序列号
            let mtfi = await model.Mtfi.findByGW(gw_id, gw_sn);
            if(mtfi){
                gw_address  = mtfi.gw_address;
                gw_port = mtfi.gw_port;
                ssid = mtfi.ssid;
            }
            
            let sta = await model.Sta.findByMAC(mac);  
            if(sta) {
                ip = sta.ip;
                username = sta.username;
                is_app = sta.is_app;
            }
        
            /*let [ gw_address, gw_port,ssid, ip, username, is_app ] = await Promise.all([
                model.Mtfi.findByGW(gw_id, gw_sn),
                model.Sta.findByMAC(mac)
            ]).then(([ mtfi, user ]) => {
                return mtfi && user ? [
                    mtfi.gw_address,
                    mtfi.gw_port,
                    mtfi.ssid,
                    user.ip,
                    user.username,
                    user.is_app
                ] : [];
            }).catch(err => {
                ctx.logger.error(err);
                return [];
            });*/
            tag = ctx.query.tag === 'app' ? "app" : (is_app ? "app": "");
            // 设置is_app为false
            // await model.Sta.updateIsApp(gw_id, mac, false);
            // 非法请求
            if (/*!gw_address ||*/ !username) {
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
            if(tag === 'app'){ // 表示在app中打开
                // wifi名称
                if(!wifi || wifi === '<unknown ssid>'){
                    wifi = ssid;
                }
                let wifiname = wifi;
                // 青藏铁路介绍
                let qzintro = conf.qzintroduce;
                
                // 跑马灯新闻
                let zlnews = await ctx.service.news.listByType('normal');
                let rollNews = null;
                if(zlnews.length>0){
                    rollNews = zlnews[0];
                }
                let news = await ctx.service.news.lists(1, 3);
                // 3个电影 all 表示全部类型
                let films = await ctx.service.film.lists('all', 1, 3);
                // 3个小说
                let novels = await ctx.service.novel.lists('all', 1, 3);
                // 3个游戏
                let games = await ctx.service.game.lists('all', 1, 3);
                // 设置登录信息
                ctx.session.mac = mac;
                ctx.session.username = username;

                return await ctx.render('home/index', {
                    mac: mac,
                    status: token.auth,
                    //status: true,
                    uname: token.username,
                    online: online,
                    offline: offline,
                    wifiname: wifiname,
                    users: users,
                    flow: flow,
                    qzintro: qzintro,
                    rollNews: rollNews,
                    news: news,
                    films: films,
                    novels: novels,
                    games: games,
                    device: device
                });  
            }else{ // 表示在弹出页面打开
                //return await ctx.redirect('/app/download');
                return await ctx.render('home/indexold', {
                    mac: mac,
                    status: token.auth,
                    uname: token.username,
                    online: online,
                    offline: offline,
                    users: users,
                    flow: flow
                });
            }
        }

        async message(ctx) {
            ctx.redirect('http://192.168.0.1:2060/wifidog/redirect');
        }

        async books(ctx) {
            let tpl = await ctx.renderView('home/books', { books: conf.BOOK_LIST });
            let file = path.join(app.baseDir, 'mediacenter/books.html');

            await new Promise((resolve, reject) => {
                fs.writeFile(file, tpl, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve('ok');
                });
            });

            ctx.body = tpl;
        }

        async movies(ctx) {
            let tpl = await ctx.renderView('home/movies', { films: conf.FILM_LIST });
            let file = path.join(app.baseDir, 'mediacenter/movies.html');

            await new Promise((resolve, reject) => {
                fs.writeFile(file, tpl, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve('ok');
                });
            });

            ctx.body = tpl;
        }

       async player(ctx) {
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
        }

        async mybooks(ctx) {
            return await ctx.render('home/mybooks');
        }

        async buy(ctx) {
            return await ctx.render('home/buybefore');
        }

        async downloadApp(ctx) {
            return await ctx.render('home/downloadApp');
        }

        // 播放电影
        async playervideo(ctx) {
            let filmid = ctx.params.id;
            // 检测电影是否已经购买 todo
            //await ctx.service.myfilm.find

            let film = await ctx.service.film.getFileById(filmid);
            return await ctx.render('home/playervideo', {film: film});
        }

        async splashAdv(ctx) {
            let advList = [
                {
                    name: '豆皮',
                    img: '/public/upload/doupi.jpg',
                    httpurl: 'http://h5.coolpi360.com/static/kupi_wifi_v1.2.0_2018-09-05.apk?ylkjtag=ylkjadv'
                },
                {
                    name: '春雨医生',
                    img: '/public/upload/chunyu_v.png',
                    httpurl: 'http://api.chunyuyisheng.com/download/chunyu/latest/?vendor=tianlushouye&ylkjtag=ylkjadv'
                }
            ];
            let ranNum = parseInt(Math.random()*2);
            let adv = advList[ranNum];
            if(!adv) {
                adv = advList[0];
            }
            ctx.body = adv;
        }
        
        async adv(ctx) {
            let advList = [
                {
                    name: '热血传奇',
                    img: '/public/upload/rexuecq.jpeg',
                    httpurl: 'https://rxcq.tantanyou.com/?sp=450001&ss=WIFI&ts=0001?ylkjtag=ylkjadv'
                },
                {
                    name: '春雨医生',
                    img: '/public/upload/chunyu.png',
                    httpurl: 'http://api.chunyuyisheng.com/download/chunyu/latest/?vendor=tianlushouye&ylkjtag=ylkjadv'
                }
            ];
            let ranNum = parseInt(Math.random()*2);
            let adv = advList[ranNum];
            if(!adv) {
                adv = advList[0];
            }
            ctx.body = adv;
        }

        async tianluwifi(ctx){
            let mac = ctx.query.mac;
            if(!mac){
                return;
            }
            let {referer} = ctx.query;
            let wifis = await ctx.service.wifi.lists();
            return await ctx.render('home/buy', {
                mac: mac,
                referer: referer,
                wifis: wifis
            });
        }
        
        async buysuccess(ctx) {
            let { subject, description, mac } = ctx.query;
            
            return await ctx.render('home/flowBuySuccess', {
                mac: mac,
                subject: subject,
                description: description
            });
        }

        async mycenter(ctx) {
            let { mac } = ctx.query;
            if(!mac){
                return;
            }
            let { username } = await model.Sta.findByMAC(mac);
            
            if( username ){
                username = username.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
            }
            
            return await ctx.render('home/mycenter', {
                tel: username,
                mac: mac
            });
        }

        //type (novel,film,wifi)
        async alreadybuy(ctx) {
            //console.log(ctx.query);
            try {
                let { mac,wmac } = ctx.query;
                if(wmac){
                    wmac = wmac.toLowerCase();
                }
                if(!mac){
                    return;
                }
                // 请求盒子的某个资源，判断是否连接的是盒子 true 为连接的盒子，false为没有连接盒子
                let config = ctx.app.config;
                let deploy = config.deploy;
                let deviceaddress = config.deviceaddress;
                let isDevice =  null;
                if(deploy && wmac){
                    isDevice =  await model.Mtfi.findByLickMac(wmac);
                }
                
                // 校验type
                let type = ctx.params.type;
                let data = [];
                if(type === 'novel') {
                    data = await ctx.service.mynovel.lists(mac);
                    if(isDevice) {
                        data.map((item)=>{
                            item.novel.httpurl = `${deviceaddress}${item.novel.httpurl}`;
                        });
                    }
                }else if(type === 'film'){
                    data = await ctx.service.myfilm.lists(mac);
                    if(isDevice) {
                        data.map((item)=>{
                            item.film.httpurl = `${deviceaddress}${item.film.httpurl}`;
                        });
                    }
                }else if(type === 'wifi'){
                    // 查询购买的flow  todo
                    //data = await ctx.service.mywifi.lists(mac);
                    data = await ctx.service.mywifi.listsOrder(mac);
                }else{
                    return;
                }

                return await ctx.render('home/myalreadyBuy', {
                    mac: mac,
                    type: type,
                    data: data
                });
            } catch (error) {
                console.log(error);
            }
            
        }

        async problem(ctx) {
            return await ctx.render('home/comProblems');
        }

        async advice(ctx) {
            let {mac} = ctx.query;
            if(!mac){
                return;
            }
            return await ctx.render('home/problemFeedback', {
                mac: mac
            });
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

        async adviceCommit(ctx){
            let { mac, type, content } = ctx.request.body;
            
            if(!mac || !type || !content){
                ctx.body = {
                    isSuccess: false,
                    msg: '字段缺失'
                }
                return;
            }
            type = type.substring(0,10);
            content = content.substring(0,200);

            let { username } = await model.Sta.findByMAC(mac);
            if(!username){
                ctx.body = {
                    isSuccess: false,
                    msg: '账户不存在'
                }
                return;
            }
            // 查询是否有未审阅的反馈
            let advice = await model.Advice.findRecordByUserAndReview(username);
            if(advice){
                ctx.body = {
                    isSuccess: false,
                    msg: '正在处理上一次反馈，请稍候'
                }
                return;
            }
            
            advice = await model.Advice.createAdvice({
                type: type,
                content: content,
                username: username
            });

            if(advice){
                ctx.body = {
                    isSuccess: true,
                    msg: '提交成功'
                }
                // 开启定时器，30分钟后将自动审阅
                setTimeout(()=>{
                    model.Advice.updateReviewById(advice.id);
                }, 1800000);
            }else{
                ctx.body = {
                    isSuccess: false,
                    msg: '提交失败'
                }
            }
        }

        async appcontroller(ctx) {
            /** 
             *  去mti查找，如果没有，内部重定向/wifi/login?mac=&tag=app
             *  如果有，
             */
            let wmac = ctx.params.wmac; // 设备mac
            let mmac = ctx.params.mmac; // 手机mac
            let wifiname = ctx.params.wifi;
            wmac = wmac.toLowerCase();
            mmac = mmac.toLowerCase();
            let gateWay = conf.deviceaddress;
            // 判断wmac是否存在mtfis表中，如果存在
            let mtifi =  await model.Mtfi.findByLickMac(wmac);
            if(mtifi){
                await model.Sta.updateIsApp(wmac, mmac, true);
                ctx.redirect(gateWay);
            }
            else {
                //mac, wifi, tag
                wifiname = encodeURIComponent(wifiname);
                let url = `/wifi/login?mac=${mmac}&wifi=${wifiname}&tag=app&device=no`;
                ctx.redirect(url);
            }
        }
        // ios端验证绑定的发送验证码接口
        async iossmscode(ctx) {
            let { mobile } = ctx.request.body;
            let key = `SMS:ios`;
            let ttl = `${key}:TTL`;
            let day = moment().date();
            let code = new Chance().string({
                length: 6,
                pool: "0123456789"
            });
            //console.log(code);
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
        // iOS端验证绑定接口
        async iosVeryBind(ctx) {
            let { mobile, code } = ctx.request.body;
            try {
                ctx.validate({
                    "code": {
                        type: 'string',
                        max: 6
                    }
                });
            } catch (err) {
                ctx.body = {
                    "code": 201,
                    "msg": "验证码输入错误"
                };
                return;
            }

            let key = `SMS:ios:${mobile}`;
            let val = await redis.get(key);

            if (val !== code) {
                ctx.body = {
                    "code": 202,
                    "msg": "验证码输入错误或已失效"
                };
                return;
            }else {
                ctx.body = {
                    "code": 200,
                    "msg": "验证码正确"
                };
            }
        }
        
        async iosEntry(ctx) {
            try {
                ctx.validate({
                    // "wmac": {
                    //     type: 'string',
                    //     format: /^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/
                    // },
                    "telphone": {
                        type: 'string',
                        format: /^(1[3456789][0-9]{9})$/
                    }
                }, ctx.params);
            } catch (error) {
                ctx.body = {
                    code: 203,
                    msg: '手机号格式不正确'
                }
                return;
            }
            let { wmac, telphone, wifiname } = ctx.params;
            let gateWay = conf.deviceaddress;
            if(wmac){
                wmac = wmac.toLowerCase();
            }
            // 根据手机号查找是否有绑定记录
            let sta = await model.Sta.findByMobile(telphone);
            // 判断wmac是否存在mtfis表中，如果存在
            let mtifi =  await model.Mtfi.findByLickMac(wmac);
            let res = {};
            if(sta.username && mtifi){
                await model.Sta.updateIsApp(wmac, sta.mac, true);
                res = {
                    code: 200,
                    msg: 'redirect',
                    telphone: sta.username,
                    mac: sta.mac,
                    url: gateWay
                };
            }else if(sta.username && !mtifi){
                res = {
                    code: 200,
                    msg: 'redirect',
                    telphone: sta.username,
                    mac: sta.mac,
                    url: `http://tianlu.5uwifi.com:8081/wifi/login?mac=${sta.mac}&wifi=${wifiname}&tag=app&device=no`
                };
            }else if(!sta.username && mtifi){
                res = {
                    code: 202,
                    msg: 'redirect',
                    url: gateWay
                };
            }else {
                res = {
                    code: 201,
                    msg: "请首先连接列车wifi绑定，再使用",
                    url: ''
                }
            }
            ctx.body = res;
        }

        async indexold (ctx){
            return await ctx.render('home/indexold', {
                mac: '',
                status: 1,
                uname: 'sd',
                online: "true",
                offline: "false",
                users: 10,
                flow: 1000
            });
        }
    }
    return Home;
};
