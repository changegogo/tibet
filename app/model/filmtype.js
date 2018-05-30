/**
 * film type model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, FLOAT, DOUBLE, Op} = app.Sequelize;
    const OP = app.Sequelize.op;

    const FilmType = app.model.define('filmtype', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "name": STRING,
        "created_at": DATE,
        "updated_at": DATE
    } );

    FilmType.createOrUpdate = function (data){
        return Promise.resolve();
    };

    FilmType.findById = function (id){
        return FilmType.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( filmtype => {
            return filmtype && filmtype.get({ plain: true });
        });
    };

    FilmType.findAllByTypeAndPage = function (page, pageSize){
        return FilmType.findAll({
            order: [
                ["updated_at", "desc"]
            ],
            offset: (page - 1) * pageSize,
            limit: pageSize
        }).then( filmtypes => {
            let filmtype_plain = filmtypes.map((filmtype)=>{
                return filmtype.get( {plain: true} )
            });
            return filmtype_plain;
        });
    };

    FilmType.delById = function (id){
        return FilmType.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    // 获取新闻的总条数
    FilmType.total = function(){
        return FilmType.count();
    }

    return FilmType;
}