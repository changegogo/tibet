/**
 * novel model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, DOUBLE} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Novels = app.model.define('novel', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "name": STRING,     // 名称
        "author": STRING,   // 作者
        "img": STRING,      // 题图
        "price": STRING,    // 小说价格
        "description": STRING, // 简介描述
        "httpurl": STRING,  // 地址
        "isfree": {// 是否是免费小说 // free免费 pay付费
            "type": STRING,
            "default": "pay"
        }, 
        "created_at": DATE,
        "updated_at": DATE
    } );

    Novels.createOrUpdate = function (data){
        return Promise.resolve();
    };

    Novels.findById = function (id){
        return Novels.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( Novels => {
            return Novels && Novels.get({ plain: true });
        });
    };

    Novels.findAllByTypeAndPage = function (type, page, pageSize){
        let wh = {};
        type != 'all' ? wh.id = type : wh;
        return Novels.findAll({
            order: [
                ["created_at", "desc"]
            ],
            include: [
                {
                    model: app.model.Noveltype,
                    where: wh
                }
            ],
            // offset: (page - 1) * pageSize,
            // limit: pageSize
        }).then( novels => {
            let novels_plain = novels.map( novelmodel => {
                return novelmodel.get( {plain: true} );
            });
            return novels_plain;
        });
    };

    Novels.delById = function (id){
        return Novels.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    Novels.total = function(){
        return Novels.count();
    }

    return Novels;
}