/**
 * novel model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, DOUBLE, Op} = app.Sequelize;
    const OP = app.Sequelize.op;

    const Novels = app.model.define('novel', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "name": STRING,     // 名称
        "author": STRING,   // 作者
        "img": STRING,      // 题图
        "price": DOUBLE,    // 小说价格
        "description": STRING, // 简介描述
        "httpurl": STRING,  // 地址
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
                ["updated_at", "desc"]
            ],
            include: [
                {
                    model: app.model.Noveltype,
                    where: wh
                }
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }).then( Novels => {
            return Novels;
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