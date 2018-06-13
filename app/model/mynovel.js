/**
 * 我的书库（小说） model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, DOUBLE} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Mynovels = app.model.define('mynovel', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "tradeNumber": STRING, //订单号
        "tradeNo": STRING, //交易号码
        "username": STRING, //  所有者
        "totalRmb": STRING, // 价格
        "progress": INTEGER,// 读书进度 整数 80  80%
        "purchasetype": STRING, // zfb支付宝 wx微信
        "status": STRING, // 订单状态
        "created_at": DATE,
        "updated_at": DATE
    } );

    Mynovels.insertData =  function (data){
        data.nove_id = data.shopId;
        return Mynovels.create(data)
            .then((mynovel) => {
                return mynovel;
            });
    };

    Mynovels.findAllMyNovel = function(username, status='all'){
        let wh = (status === 'all') ? {} : {status: status};
        wh.username = username;
        return Mynovels.findAll({
            where: wh,
            include: [
                {
                    model: app.model.Novel,
                    include: app.model.Noveltype
                }
            ],
            order: [
                ["created_at", "desc"]
            ]
        }).then((mynovels)=>{
            let mynovel_plain = mynovels.map((myNovelModel)=>{
                return myNovelModel && myNovelModel.get({plain: true});
            });
            return mynovel_plain;
        })
    }

    Mynovels.findByIdMyNovel = function(id){
        return Mynovels.findOne({
            include: [
                {
                    model: app.model.Novel,
                    include: app.model.Noveltype
                }
            ],
            where: {
                id: id
            }
        }).then( (mynovel)=>{
            return mynovel && mynovel.get({plain: true});
        })
    }

    // 使用唯一订单号查找记录
    Mynovels.findByTradeNumber = function(tradeNumber){
        return Mynovels.findOne({
            where: {
                tradeNumber: tradeNumber
            }
        }).then( (mynovel) => {
            return mynovel;
        })
    }

    Mynovels.findByUserAndIdOk = function(username, id){
        return Mynovels.findOne({
            where: {
                username: username,
                nove_id: id,
                status: 'ok'
            }
        }).then( (mynovel)=>{
            return mynovel && mynovel.get({plain: true});
        })
    }

    Mynovels.findByUserAndId = function(username, id){
        return Mynovels.findOne({
            where: {
                username: username,
                nove_id: id
            }
        }).then( (mynovel)=>{
            return mynovel && mynovel.get({plain: true});
        })
    }

    

    return Mynovels;
}