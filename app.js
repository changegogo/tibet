module.exports = app => {
    if (app.config.env === 'local') {
        app.beforeStart(async function () {
            // 关联关系
            app.model.Film.belongsTo( app.model.Filmtype  , {"foreignKey":"filmtype_id"} );
            app.model.Filmtype.hasMany(     app.model.Film , {"foreignKey":"filmtype_id"} );

            app.model.Novel.belongsTo( app.model.Noveltype  , {"foreignKey":"noveltype_id"} );
            app.model.Noveltype.hasMany(     app.model.Novel , {"foreignKey":"noveltype_id"} );

            app.model.Game.belongsTo( app.model.Gametype  , {"foreignKey":"gametype_id"} );
            app.model.Gametype.hasMany(     app.model.Game , {"foreignKey":"gametype_id"} );
            await app.model.sync({force: false});
        });
    }
};
