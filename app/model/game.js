/**
 * game model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, Op} = app.Sequelize;
    const OP = app.Sequelize.op;

    const Games = app.model.define('game', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "name": STRING,
        "description": STRING,
        "imgsmall": STRING,
        "imgbig": STRING,
        "httpurl": STRING, // 下载地址
        "created_at": DATE,
        "updated_at": DATE
    } );

    Games.createOrUpdate = function (data){
        return Promise.resolve();
    };

    Games.findById = function (id){
        return Games.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( geme => {
            return geme && geme.get({ plain: true });
        });
    };

    Games.findAllByTypeAndPage = function (type, page, pageSize){
        let wh = {};
        type != 'all' ? wh.id = type : wh;
        return Games.findAll({
            order: [
                ["updated_at", "desc"]
            ],
            include: [
                {
                    model: app.model.Gametype,
                    where: wh
                }
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }).then( games => {
            return games;
        });
    };

    Games.delById = function (id){
        return Games.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    // 获取新闻的总条数
    Games.total = function(){
        return Games.count();
    }

    return Games;
}