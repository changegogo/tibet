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
        "username": STRING, //  所有者
        "progress": INTEGER,// 读书进度 整数 80  80%
        "purchasetype": STRING, // zfb支付宝 wx微信
        "created_at": DATE,
        "updated_at": DATE
    } );

    Mynovels.findAllMyNovel = function(){
        return Mynovels.findAll({
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

    

    return Mynovels;
}