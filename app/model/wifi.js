/**
 * wifi model
 */
module.exports = app => {
    const { STRING, TEXT, DATE, UUID, UUID4, INTEGER, FLOAT, DOUBLE} = app.Sequelize;
    const OP = app.Sequelize.Op;

    const Wifis = app.model.define('wifi', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "amount": STRING,      // wifi大小 Mb
        "price": STRING,     // wifi价格 元
        "status": STRING,     // wifi状态 备货or出售 stockup or sell
        "created_at": DATE,
        "updated_at": DATE
    } );

    Wifis.insertData = function (data){
        return Wifis.create(data);
    };

    Wifis.findByIdwifi = function (id){
        return Wifis.findOne({
            "where": {
                "id": {
                    [OP.eq]: id
                }
            }
        }).then( wifi => {
            return wifi && wifi.get({ plain: true });
        });
    };

    Wifis.findAllByTypeAndPage = function (){
        return Wifis.findAll({
            order: [
                ["amount", "asc"]
            ]
        }).then( wifis => {
            let wifis_plain = wifis.map((wifi)=>{
                return wifi.get( {plain: true} );
            });
            return wifis_plain;
        });
    };

    Wifis.delById = function (id){
        return Wifis.destroy({
            "where": {
                "id": id
            }
        }).then(count => {
            return count;
        });
    };

    // 获取新闻的总条数
    Wifis.total = function(){
        return Wifis.count();
    }

    return Wifis;
}