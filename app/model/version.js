/**
 * app版本控制
 */
module.exports = app => {
    const { STRING, BOOLEAN, DATE, INTEGER, Op} = app.Sequelize;

    const Version = app.model.define('version', {
        "id": {
            "type": INTEGER,
            "autoIncrement": true,
            "primaryKey": true
        },
        "os": STRING, // android or ios
        "version": STRING,  // 版本号码
        "force": BOOLEAN, //是否强制更新
        "httpurl": STRING, // 下载地址
        "created_at": DATE,
        "updated_at": DATE
    } );

    Version.createOrUpdate = function (data){
        return !data.id ? 
            Version.create(data)
              .then(version => {
                return version && version.get({plain: true});
              }): 
              Version.update({
                "os": data.os,
                "version": data.version,
                "httpurl": data.httpurl,
                "force": data.force,
                "httpurl": data.httpurl
            }).then( ([ count, versions ]) => {
                let [ version ] = versions;
                return version && version.get({ plain: true });
            });
    };

    Version.findById = function (id){
        return Version.findOne({
            "where": {
                "id": {
                    [Op.eq]: id
                }
            }
        }).then( version => {
            return version && version.get({ plain: true });
        });
    };
    // 通过系统查找
    Version.findByOs = function (os) {
        return Version.findOne({
            where: {
                "os": {
                    [Op.eq]: os
                }
            }
        }).then( version => {
            return version && version.get({ plain: true });
        })
    }

    Version.findAllOs = function (){
        return Version.findAll({
            order: [
                ["created_at", "desc"]
            ]
        }).then( versions => {
            return versions;
        });
    };



    return Version;
}