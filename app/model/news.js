/**
 * 藏旅行新闻
 */
module.exports = app => {
    const { STRING, TEXT, DATE, INTEGER, Op} = app.Sequelize;

    const News = app.model.define('new', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "title": STRING,
        "type": STRING, // normal臧旅新闻 notice通知公告
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
                return news && news.get({plain: true});
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
                    [Op.eq]: id
                }
            }
        }).then( news => {
            return news && news.get({ plain: true });
        });
    };

    News.findAllByPage = function (page, pageSize){
        return News.findAll({
            order: [
                ["created_at", "desc"]
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }).then( newss => {
            return newss;
        });
    };
    // type => normal notice
    News.findByType = function (type){
        return News.findAll({
            where: {
                type: type
            },
            order: [
                ["created_at", "desc"]
            ]
        }).then( newss => {
            let news_plain = newss.map((news)=>{
                return news.get({plain: true}); 
            })
            return news_plain;
        })
    }

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