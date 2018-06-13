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

    Sta.updateByMAC = function (mac, ip, gw_id, gw_sn, is_app = false) {
        return Sta.upsert({
            "mac": mac,
            "ip": ip,
            "gw_id": gw_id,
            "gw_sn": gw_sn,
            "is_app": is_app
        }, {
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

    Sta.updateIsApp = function(mac, is_app = false){
        return Sta.update({
            "is_app": is_app
        },{
            where: {
                "mac": {
                    [OP.eq]: mac
                }
            }
        }).then( c => {
            return c;
        })
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

    return Sta;
};
