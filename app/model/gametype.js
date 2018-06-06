/**
 * game type model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, FLOAT, DOUBLE, Op} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const GameType = app.model.define('gametype', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "name": STRING,
        "created_at": DATE,
        "updated_at": DATE
    } );

    GameType.createOrUpdate = function (data){
        return Promise.resolve();
    };

    GameType.findById = function (id){
        return GameType.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( gametype => {
            return gametype && gametype.get({ plain: true });
        });
    };

    GameType.findAllByType = function (){
        return GameType.findAll({
            order: [
                ["updated_at", "desc"]
            ]
        }).then( gametypes => {
            let gametype_plain = gametypes.map((gametype)=>{
                return gametype.get( {plain: true} )
            });
            return gametype_plain;
        });
    };

    GameType.delById = function (id){
        return GameType.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    // 获取新闻的总条数
    GameType.total = function(){
        return GameType.count();
    }

    return GameType;
}