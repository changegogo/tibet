/**
 * WIFI 终端信息
 */
module.exports = app => {
    const { STRING, INTEGER, BOOLEAN, DATE } = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Sta = app.model.define('sta', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        // 当前 MTfi 信息
        "gw_id": STRING,
        "gw_sn": STRING,

        // 当前 wifi 终端 IP 地址
        "ip": STRING,

        // wifi 终端 MAC 地址
        "mac": {
            "type": STRING,
            "unique": true
        },

        // 绑定的手机号
        "username": STRING,

        // 用户所属用户组
        "usergroup": STRING,

        // 用于设备设置该用户的最大在线时长,单位为"second"
        "timeout": INTEGER,

        // 是否拒绝认证
        // 相当于黑名单
        "auth_deny": {
            "type": BOOLEAN,
            "defaultValue": false
        },

        "is_app": {
            "type": BOOLEAN,
            "defaultValue": false
        },

        "created_at": DATE,
        "updated_at": DATE,
    });

    Sta.findByMAC = function (mac) {
        try { 
            mac = mac.toLowerCase();
            return Sta.findOne({
                "where": {
                    "mac": {
                        [OP.eq]: mac
                    }
                }
            }).then(sta => {
                return sta ? sta.get({ plain: true }) : {};
            }).catch((error)=>{
                console.log(error);
                return {};
            });
        } catch (error) {
            return {};
        }
    };

    Sta.findByMobile = function (mobile) {
        return Sta.findOne({
            "where": {
                "username": {
                    [OP.eq]: mobile
                }
            }
        }).then(sta => {
            return sta ? sta.get({ plain: true }) : {};
        }).catch((error)=>{
            console.log(error);
            return {};
        });
    };

    Sta.updateByMAC = function (mac, ip, gw_id, gw_sn, is_app) {
        let data;
        if(is_app) {
            data = {
                "mac": mac,
                "ip": ip,
                "gw_id": gw_id,
                "gw_sn": gw_sn,
                "is_app": is_app
            }
        }else {
            data = {
                "mac": mac,
                "ip": ip,
                "gw_id": gw_id,
                "gw_sn": gw_sn
            }
        }
        return Sta.upsert(data, {
            "where": {
                "mac": {
                    [OP.eq]: mac
                }
            },
            "returning": true
        }).then(([ user, isNew ]) => {
            //console.log(user);
            console.log("isNew-->"+isNew);
            return [ user.get({ plain: true }), isNew ];
        }).catch(err =>{
            console.log("err");
            console.log(err);
        });
    };

    // 通过telphone更新mtfi信息
    Sta.updateByTelphone = function(telphone, gw_id, gw_sn) {
        return Sta.update({
            "gw_id": gw_id,
            "gw_sn": gw_sn
        },{
            where: {
                username: telphone
            }
        }).then(affectedCount => {
            return affectedCount;
        });
    }

    Sta.updateIsApp = function(wmac, mac, is_app = false){
        let value = wmac.slice(0, wmac.length-1)+'%';
        return Sta.update({
            "is_app": is_app
        },{
            where: {
                "mac": {
                    [OP.eq]: mac
                },
                "gw_id": {
                    [OP.iLike]: value
                }
            }
        }).then( c => {
            //console.log('updateIsApp'+c);
            return c;
        }).catch(err=>{
            console.log(err);
        });
    }

    Sta.authMobile = function (mac, mobile) {
        return Sta.update({
            "username": mobile
        }, {
            "where": {
                "mac": {
                    [OP.eq]: mac
                }
            },
            "returning": true
        }).then(([ affectedCount, affectedRows ]) => {
            let [ sta ] = affectedRows;
            return sta.get({ plain: true });
        });
    };

    Sta.existsMAC = function (mac) {
        return Sta.count({
            "where": {
                "mac": {
                    [OP.eq]: mac
                },
                "username": {
                    [OP.is]: null
                }
            }
        }).then(c => {
            return !!c;
        });
    };

    // 查找或者创建用户信息
    Sta.findOrGenerate = async function (mtfi, telphone, mac, ip) {
        return Sta.findOrCreate({
            where: {
                username: telphone
            },
            defaults: {
                ...mtfi,
                username: telphone,
                mac: mac,
                ip: ip
            }
        }).then(([ sta, isNew ]) => {
            return [ sta.get({ plain: true }), isNew ];
        });
    }

    // 注册统计
    Sta.statistics = async function () {
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth()+1;
        let day = time.getDate();
        let timeStr = `${year}-${month}-${day}`;
        try {
            // 当日注册
            let dayRegCount = await app.model.Sta.count({
                where: {
                    'username': {
                        [OP.like]: '1%'
                    },
                    'updated_at': {
                        [OP.gt]: `${timeStr} 00:00:00`,
                        [OP.lt]: `${timeStr} 23:59:59`
                    }
                }
            });

            // 日活
            let daylifeCount = await app.model.Sta.count({
                where: {
                    'updated_at': {
                        [OP.gt]: `${timeStr} 00:00:00`,
                        [OP.lt]: `${timeStr} 23:59:59`
                    }
                }
            });

            // 总共注册
            let allRegCount = await app.model.Sta.count({
                where: {
                    'username': {
                        [OP.like]: '1%'
                    }
                }
            });
 
            // 总共访问量
            let allVisitCount = await app.model.Sta.count();
            return {
                dayRegCount: dayRegCount * 11,
                daylifeCount: daylifeCount * 11,
                allRegCount: allRegCount * 11,
                allVisitCount: allVisitCount * 11
            }
           
        } catch (error) {
            dayRegCount = 0;
            daylifeCount = 0;
            allRegCount = 0
            allVisitCount = 0;
            return {
                dayRegCount,
                daylifeCount,
                allRegCount,
                allVisitCount
            }
        }
        
    };

    return Sta;
};
