/**
 * novel type model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, FLOAT, DOUBLE, Op} = app.Sequelize;
    const OP = app.Sequelize.op;

    const NovelType = app.model.define('noveltype', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "name": STRING,
        "created_at": DATE,
        "updated_at": DATE
    } );

    NovelType.createOrUpdate = function (data){
        return Promise.resolve();
    };

    NovelType.findById = function (id){
        return NovelType.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( noveltype => {
            return noveltype && noveltype.get({ plain: true });
        });
    };

    NovelType.findAllNovel = function (){
        return NovelType.findAll({
            order: [
                ["id", "asc"]
            ]
        }).then( noveltypes => {
            let noveltype_plain = noveltypes.map((noveltype)=>{
                return noveltype.get( {plain: true} )
            });
            return noveltype_plain;
        });
    };

    NovelType.delById = function (id){
        return NovelType.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    // 获取新闻的总条数
    NovelType.total = function(){
        return NovelType.count();
    }

    return NovelType;
}