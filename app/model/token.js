/**
 * WIFI 终端 TOKEN 管理
 */
module.exports = app => {
    const { STRING, DATE, UUID, UUIDV4, INTEGER, Op } = app.Sequelize;
    const redis = app.redis;

    const Token = app.model.define('token', {
        // MTFi 设备的 id, wifidog 中使用设备的 MAC
        "gw_id": STRING,

        // MTFi设备的序列号
        "gw_sn": STRING,

        // wifi 终端 IP 地址
        "ip": STRING,

        // wifi 终端 MAC 地址
        "mac": STRING,

        // 是否 认证成功
        // 0 为 失败,
        // 1 为 成功,
        // 2 为 退出登录后需生成新 token
        "auth": INTEGER,

        // Portal 生成的连接标识
        "token": {
            "type": UUID,
            "defaultValue": UUIDV4,
            "primaryKey": true
        },

        // 手机号
        "username": STRING,
        "created_at": DATE,
        "updated_at": DATE,
    });

    /**
     * 获取`WIFI终端`在某`MTFi设备`中的`token`
     *
     * 并发控制:
     *  每个`WIFI终端`在每个`MTFi设备`只有唯一`token`
     *  1.`redis.setex`来实现
     *  2.`findOrCreate`事务的`SERIALIZABLE`隔离级别也可以实现
     */
    Token.findByLock = async function (gw_id, gw_sn, ip, mac, username) {
        let lock = `LOCK:${gw_id}:${mac}`;
        let isSetnx = await redis.setnx(lock, 'lock');
        if (isSetnx) {
            let token, isNew;

            try {
                [ token, isNew ] = await Token.findOrGenerate(gw_id, gw_sn, ip, mac, username);
            } finally {
                //await redis.del(lock).catch(() => {});
            }

            return [ token, isNew ];
        }

        return await Token.findByTimes(gw_id, mac).then(token => {
            return [ token, false ];
        });
    };

    Token.findOrGenerate = function (gw_id, gw_sn, ip, mac, username) {
        return Token.findOrCreate({
            "where": {
                "gw_id": {
                    [Op.eq]: gw_id
                },
                "mac": {
                    [Op.eq]: mac
                },
                "auth": {
                    [Op.ne]: 2
                }
            },
            "defaults": {
                "gw_id": gw_id,
                "gw_sn": gw_sn,
                "mac": mac,
                "ip": ip,
                "auth": 0,
                "username": username
            }
        }).then(([ token, isNew ]) => {
            return [ token.get({ plain: true }), isNew ];
        });
    };

    Token.findByMAC = function (gw_id, mac) {
        return Token.findOne({
            "where": {
                "gw_id": {
                    [Op.eq]: gw_id
                },
                "mac": {
                    [Op.eq]: mac
                },
                "auth": {
                    [Op.ne]: 2
                }
            }
        }).then(token => {
            return token && token.get({ plain: true });
        });
    };

    Token.findByTimes = async function (gw_id, mac, times = 5) {
        while (times > 0) {
            let token = await new Promise(resolve => {
                setImmediate(async () => {
                    resolve(await Token.findByMAC(gw_id, mac).catch(err => null));
                }, 100)
            });

            if (token) {
                return token;
            }

            // 最大重试次数
            times--;
        }

        return null;
    };

    Token.online = function (gw_id, mac) {
        return Token.update({
            "auth": 1
        }, {
            "where": {
                "gw_id": {
                    [Op.eq]: gw_id
                },
                "mac": {
                    [Op.eq]: mac
                },
                "auth": {
                    [Op.ne]: 2
                }
            },
            "returning": true

        }).then(([ affectedCount, affectedRows ]) => {
            let [ token ] = affectedRows;
            return token.get({ plain: true });
        }).then(token => {
            if (token) {
                return {
                    auth: token.auth,
                    username: token.username
                };
            }

            return { auth: 0 };
        });
    };

    Token.offline = function (gw_id, mac) {
        return Token.update({
            "auth": 2
        }, {
            "where": {
                "gw_id": {
                    [Op.eq]: gw_id
                },
                "mac": {
                    [Op.eq]: mac
                },
                "auth": {
                    [Op.eq]: 1
                }
            },
            "returning": true
        }).then(([ affectedCount, affectedRows ]) => {
            let unlock = redis.del(`LOCK:${gw_id}:${mac}`);
            let [ token ] = affectedRows;
            return Promise.all([ unlock, token ]);
        }).then(([ _, token ]) => {
            return token && token.get({ plain: true });
        });
    };

    Token.findByToken = function (gw_id, token) {
        return Token.findOne({
            "where": {
                "gw_id": {
                    [Op.eq]: gw_id
                },
                "token": {
                    [Op.eq]: token
                },
                /**
                 * 为了兼容流量统计
                 * 在`logout`后重新生成`token`
                 */
                "auth": {
                    [Op.ne]: 2
                }
            }
        }).then(token => {
            return token && token.get({ plain: true });
        }).then(token => {
            if (!token) {
                return { auth: 0 };
            }

            return {
                auth: token.auth,
                username: token.username
            };
        });
    };

    Token.countByOnline = function (gw_id) {
        return Token.count({
            "where": {
                "gw_id": {
                    [Op.eq]: gw_id
                },
                "auth": {
                    [Op.eq]: 1
                }
            }
        });
    };

    return Token;
};
