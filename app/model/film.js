/**
 * film model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, FLOAT, DOUBLE} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Films = app.model.define('film', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "pos": STRING,      // 显示位置 carousel nominate精品推荐 normal列表
        "name": STRING,     // 名称
        "imgh": STRING,     // 横向图
        "imgv": STRING,     // 纵向图
        "director": STRING, // 导演
        "tostar": STRING,   // 主演
        "score": STRING,     // 评分
        "price": STRING,    // 价格
        "description": STRING, // 简介
        "httpurl": STRING, // 观看地址
        "created_at": DATE,
        "updated_at": DATE
    } );

    Films.createOrUpdate = function (data){
        return Promise.resolve();
    };

    Films.findByIdFilm = function (id){
        return Films.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( film => {
            return film && film.get({ plain: true });
        });
    };

    Films.findAllByTypeAndPage = function (type, page, pageSize){
        let wh = {};
        type != 'all' ? wh.id = type : wh;
        return Films.findAll({
            include: [
                {
                    model: app.model.Filmtype,
                    where: wh
                }
            ],
            order: [
                ["created_at", "desc"]
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }).then( films => {
            let films_plain = films.map((film)=>{
                return film.get( {plain: true} )
            });
            return films_plain;
        });
    };

    Films.delById = function (id){
        return Films.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    // 获取新闻的总条数
    Films.total = function(){
        return Films.count();
    }

    return Films;
}