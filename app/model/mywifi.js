/**
 * mywifi model 购买wifi
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, FLOAT, DOUBLE} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Mywifis = app.model.define('mywifi', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "tradeNumber": STRING, //订单号
        "tradeNo": STRING, //交易号码
        "totalRmb": STRING,     // 价格
        "username": STRING,     // 所有者
        // "amount": DOUBLE,      // wifi大小 Mb
        // "price": DOUBLE,     // wifi价格 元
        "purchasetype": STRING, // zfb支付宝 wx微信
        "status": STRING, // 订单状态
        "created_at": DATE,
        "updated_at": DATE
    } );

    Mywifis.insertData =  function (data){
        data.wifi_id = data.shopId;
        return Mywifis.create(data)
            .then((mywifi) => {
                return mywifi;
            });
    };

    Mywifis.findByIdMyWifi = function (id){
        return Mywifis.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( mywifi => {
            return mywifi;
        });
    };

    // 使用唯一订单号查找记录
    Mywifis.findByTradeNumber = function(tradeNumber){
        return Mywifis.findOne({
            where: {
                tradeNumber: tradeNumber
            }
        }).then( (mywifi) => {
            return mywifi;
        })
    }

    Mywifis.findAllMyWifi = function (){
        return Mywifis.findAll({
            order: [
                ["created_at", "desc"]
            ]
        }).then( mywifis => {
            let mywifis_plain = mywifis.map((wifi)=>{
                return wifi.get( {plain: true} )
            });
            return mywifis_plain;
        });
    };

    Mywifis.delById = function (id){
        return Mywifis.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    return Mywifis;
}