/**
 * 用户在线跟踪
 *
 * MTFi 定期通告 Portal  关于 WiFi 终端的连接情况，并允许 Portal 触发用户下线动作。
 */
const moment = require('moment');
const BN = require('bignumber.js');
const FLOW_UNIT = new BN(1024);
const FLOW_UNIT_SYM = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB' ];

module.exports = app => {
    const { STRING, INTEGER, BIGINT, DATE, fn, col } = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Counters = app.model.define('counters', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },

        // MTFi 设备的 id, wifidog 中使用设备的 MAC
        "gw_id": STRING,

        // MTFi设备的序列号
        "gw_sn": STRING,

        // wifi 终端 IP 地址
        "ip": STRING,

        // wifi 终端 MAC 地址
        "mac": STRING,

        // Portal 生成的连接标识
        "token": {
            "type": STRING,
            "unique": true
        },

        // 累计下行流量，单位"byte"
        "incoming": BIGINT,

        // 累计上行流量，单位"byte"
        "outgoing": BIGINT,

        // 终端上线时间
        "usedtime": INTEGER,

        "created_at": DATE,
        "updated_at": DATE,
    });

    Counters.aggr = function (mac) {
        return Counters.findOne({
            "where": {
                "mac": {
                    [OP.eq]: mac
                }
            },
            "attributes": [
                [fn('sum', col('incoming')), 'incoming'],
                [fn('sum', col('outgoing')), 'outgoing']
            ]
        }).then(c => {
            return c && c.get({ plain: true });
        });
    };

    Counters.remains = async function (mac) {
        let limit = new BN(app.config.maxFlowLimit);
        let total = await Counters.aggr(mac).then(flow => {
            return new BN(flow.incoming || 0).plus(flow.outgoing || 0);
        });

        return limit.minus(total);
    };

    Counters.flow = async function (mac) {
        let total = await Counters.remains(mac);
        let units = 'B';
        // 计算流量总量todo
        total = await app.model.Order.balance(mac, 'FLOW').then(b => {
            return total.plus(b)
        });

        if (total.isNegative()) {
            total = 0;
        }
        else {
            for (let [ i, u ] in FLOW_UNIT_SYM) {
                let r = total.div(FLOW_UNIT.pow(new BN(i)));
                if (r.lte(100)) {
                    total = r.toFixed(1);
                    units = FLOW_UNIT_SYM[i];
                    break;
                }
            }
        }

        return {
            total: total,
            units: units
        };
    };

    Counters.timeout = function (token) {
        return Counters.findOne({
            "where": {
                "token": {
                    [OP.eq]: token
                }
            },
            "attributes": [ 'updated_at' ]
        }).then(c => {
            return c && c.get({ plain: true });
        }).then(c => {
            if (!c) {
                return true;
            }

            // 最后更新时间
            let last = moment(c.updated_at);
            // 下次更新时间
            let next = last.add(300 * 2, 'seconds');

            return moment().isAfter(next);
        });
    };

    Counters.userTrace = function ({ gw_id, gw_sn, ip, mac, token, incoming, outgoing, usedtime }) {
        return Counters.upsert({
            "gw_id": gw_id,
            "gw_sn": gw_sn,
            "ip": ip,
            "mac": mac,
            "token": token,
            "incoming": parseInt(incoming),
            "outgoing": parseInt(outgoing),
            "usedtime": usedtime
        }, {
            "returning": true
        }).then(([ counter, isNew ]) => {
            return [ counter.get({ plain: true }), isNew ];
        });
    };

    return Counters;
};
