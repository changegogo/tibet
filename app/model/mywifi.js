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
        "username": STRING, //  所有者
        "amount": DOUBLE,      // wifi大小 Mb
        "price": DOUBLE,     // wifi价格 元
        "purchasetype": STRING, // zfb支付宝 wx微信
        "created_at": DATE,
        "updated_at": DATE
    } );

    Mywifis.createOrUpdate = function (data){
        return Promise.resolve();
    };

    Mywifis.findByIdMyWifi = function (id){
        return Mywifis.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( mywifi => {
            return mywifi && mywifi.get({ plain: true });
        });
    };

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

    // 获取新闻的总条数
    Mywifis.total = function(){
        return Mywifis.count();
    }

    return Mywifis;
}