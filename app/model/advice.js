/**
 * advice model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, FLOAT, DOUBLE} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Advices = app.model.define('advice', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "type": STRING,
        "content": STRING,
        "created_at": DATE,
        "updated_at": DATE
    } );

    Advices.createAdvice = function (data){
        return Advices.create(data)
            .then((advice)=>{
                return advice && advice.get({plain: true});
            })
    };

    Advices.findByIdAdvice = function (id){
        return Advices.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( advice => {
            return advice && advice.get({ plain: true });
        });
    };

    Advices.findAllAdvice = function (){
        return Advices.findAll({
            order: [
                ["created_at", "desc"]
            ]
        }).then( advices => {
            let advices_plain = advices.map((advice)=>{
                return advice.get( {plain: true} )
            });
            return advices_plain;
        });
    };

    Advices.delById = function (id){
        return Advices.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    return Advices;
}