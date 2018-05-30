/**
 * MTFi设备信息
 */
module.exports = app => {
    const { STRING, INTEGER, DATE, Op } = app.Sequelize;

    const MTFi = app.model.define('mtfi', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },

        // MTFi 设备的 id, wifidog 中使用设备的 MAC
        "gw_id": {
            "type": STRING,
            "unique": true
        },

        // MTFi设备的序列号
        "gw_sn": STRING,

        // MTFi 设备的IP(优先使用设备LAN口IP,WAN口IP也可),用于 portal 重定向到设备
        "gw_address": STRING,

        // MTFi 上 wifidog 组件监听端口
        "gw_port": STRING,

        // wifi 终端连接的 ssid,  MTFI 新增
        "ssid": STRING,

        // 瘦 ap MAC ， MTFI 新增。用于 ac 控制的认证环境
        "apmac": STRING,

        "created_at": DATE,
        "updated_at": DATE,
    });

    MTFi.findByGW = function (gw_id, gw_sn) {
        return MTFi.findOne({
            "where": {
                "gw_id": {
                    [Op.eq]: gw_id
                },
                "gw_sn": {
                    [Op.eq]: gw_sn
                }
            }
        }).then(mtfi => {
            return mtfi && mtfi.get({ plain: true });
        });
    };

    MTFi.findAndUpdate = function ({ gw_id, gw_sn, gw_address, gw_port, apmac, ssid }) {
        return MTFi.upsert({
            "gw_id": gw_id,
            "gw_sn": gw_sn,
            "gw_address": gw_address,
            "gw_port": gw_port,
            "apmac": apmac,
            "ssid": ssid
        }, {
            "returning": true
        }).then(([ mtfi, isNew ]) => {
            return [ mtfi.get({ plain: true }), isNew ];
        });
    };

    return MTFi;
};
