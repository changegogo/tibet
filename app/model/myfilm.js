/**
 * 我的电影 model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, DOUBLE} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Myfilms = app.model.define('myfilm', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "created_at": DATE,
        "updated_at": DATE
    } );

    Myfilms.findAllMyFilm = function(){
        return Myfilms.findAll({
            include: [
                {
                    model: app.model.Film,
                    include: app.model.Filmtype
                }
            ],
            order: [
                ["created_at", "desc"]
            ]
        }).then((myfilms)=>{
            let myfilm_plain = myfilms.map((myFilmModel)=>{
                return myFilmModel && myFilmModel.get({plain: true});
            });
            return myfilm_plain;
        })
    }

    Myfilms.findByIdMyFilm = function(id){
        return Myfilms.findOne({
            include: [
                {
                    model: app.model.Film,
                    include: app.model.Filmtype
                }
            ],
            where: {
                id: id
            }
        }).then( (myfilm)=>{
            return myfilm && myfilm.get({plain: true});
        })
    }

    

    return Myfilms;
}