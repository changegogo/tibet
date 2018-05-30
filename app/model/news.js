/**
 * 藏旅行新闻
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, Op} = app.Sequelize;
    const OP = app.Sequelize.op;

    const News = app.model.define('new', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "type": STRING, // normal 藏旅新闻 notice 通知公告
        "title": STRING,
        "description": STRING,
        "img_1": STRING,
        "img_2": STRING,
        "img_3": STRING,
        "content": TEXT,
        "httpurl": STRING,
        "created_at": DATE,
        "updated_at": DATE
    } );

    News.createOrUpdate = function (data){
        return !data.id ? 
            News.create(data)
              .then(news => {

              }): 
            News.update({
                "description": data.description,
                "img_1": data.img_1,
                "img_2": data.img_2,
                "img_3": data.img_3,
                "content": data.content,
                "httpurl": dat.httpurl
            }).then( ([ count, rows ]) => {
                let [ news ] = rows;
                return news.get({ plain: true });
            });
    };

    News.findById = function (id){
        return News.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( news => {
            return news && news.get({ plain: true });
        });
    };

    News.findAllByPage = function (page, pageSize){
        return News.findAll({
            order: [
                ["updated_at", "desc"]
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }).then( newss => {
            return newss;
        });
    };

    News.delById = function (id){
        return News.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    // 获取新闻的总条数
    News.total = function(){
        return News.count();
    }

    return News;
}