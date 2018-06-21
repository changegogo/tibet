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
        "totalRmb": STRING,     // 价格
        "tradeNumber": STRING,      //订单号
        "tradeNo": STRING,          //交易号码
        "username": STRING,         // 所有者
        "purchasetype": STRING, //购买类型 zfb wx
        "status": {
            "type": STRING,
            "default": "wait"
        },
        "created_at": DATE,
        "updated_at": DATE,
    });

    Order.insertData = function (record) {
        return Order.create(record)
            .then((order) => {
                return order;
            })
            .catch((err)=>{
                console.log(err);
            })
    }
    // 查询所有的流量订单，包含已付款和未付款的
    Order.findAllOrder = function(username) {
        return Order.findAll({
            where: {
                username: username,
                status: 'ok'
            },
            order: [
                ["created_at", "desc"]
            ]
        })
        .then((orders) => {
            let orders_plain = orders.map((order)=>{
                return order && order.get( {plain: true });
            });
            return orders_plain;
        })
    }

    // 使用唯一订单号查找记录
    Order.findByTradeNumber = function(tradeNumber){
        return Order.findOne({
            where: {
                tradeNumber: tradeNumber
            }
        }).then( (order) => {
            return order;
        })
    }

    Order.balance = function (mac,/* username,*/ key, from = null) {
        let where = {
            "mac": {
                [Op.eq]: mac
            },
            // "username": {
            //     [Op.eq]: username
            // },
            "key": {
                [Op.eq]: key
            },
            "status": {
                [Op.eq]: 'ok'
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
