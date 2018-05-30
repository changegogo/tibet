/**
 * MTFi设备信息
 */
module.exports = app => {
    const { STRING, BIGINT, SMALLINT, DATE, Op, fn, col } = app.Sequelize;

    const Order = app.model.define('order', {
        "mac": STRING,
        "from": {
            "type": STRING,
            // 1.BUY(购买)
            // 2.PRESENT(赠送)
            "default": "BUY"
        },
        "key": {
            "type": STRING,
            // 1.FLOW(流量)
            // 2.GOLD_COIN(代币)
            "default": "FLOW"
        },
        "val": {
            "type": BIGINT
        },
        "status": {
            "type": SMALLINT,
            "default": 0
        },
        "created_at": DATE,
        "updated_at": DATE,
    });

    Order.balance = function (mac, key, from = null) {
        let where = {
            "mac": {
                [Op.eq]: mac
            },
            "key": {
                [Op.eq]: key
            },
            "status": {
                [Op.eq]: 1
            }
        };

        if (from) {
            where.from = {
                [Op.eq]: from
            };
        }

        return Order.findOne({
            "where": where,
            "attributes": [
                [fn('sum', col('val')), 'balance']
            ]
        }).then(c => {
            return c && c.get({ plain: true });
        }).then(c => {
            if (c) {
                return c.balance || 0;
            }
            return 0;
        });
    };

    return Order;
};
