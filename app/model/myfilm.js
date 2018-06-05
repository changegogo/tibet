/**
 * 我的电影 model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, DOUBLE} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Myfilms = app.model.define('myfilm', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "tradeNumber": STRING, //订单号
        "tradeNo": STRING, //交易号码
        "totalRmb": STRING,     // 价格
        "username": STRING, //  所有者
        "purchasetype": STRING, // zfb支付宝 wx微信
        "status": STRING, // 订单状态
        "created_at": DATE,
        "updated_at": DATE
    } );

    Myfilms.insertData = function(data){
        return Myfilms.create(data);
    }

    Myfilms.findAllMyFilm = function(){
        return Myfilms.findAll({
            include: [
                {
                    model: app.model.Film,
                    include: app.model.Filmtype
                }
            ],
            order: [
                ["created_at", "desc"]
            ]
        }).then((myfilms)=>{
            let myfilm_plain = myfilms.map((myFilmModel)=>{
                return myFilmModel && myFilmModel.get({plain: true});
            });
            return myfilm_plain;
        })
    }

    // 使用唯一订单号查找记录
    Myfilms.findByTradeNumber = function(tradeNumber){
        return Myfilms.findOne({
            where: {
                tradeNumber: tradeNumber
            }
        }).then( (myfilm) => {
            return myfilm;
        })
    }

    Myfilms.findByIdMyFilm = function(id){
        return Myfilms.findOne({
            include: [
                {
                    model: app.model.Film,
                    include: app.model.Filmtype
                }
            ],
            where: {
                id: id
            }
        }).then( (myfilm)=>{
            return myfilm && myfilm.get({plain: true});
        })
    }

    

    return Myfilms;
}