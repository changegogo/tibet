const Controller = require('egg').Controller;

class GameController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        let { tag } = ctx.query;
        // 头部轮播图
        let header = await ctx.service.game.lists('all', 1, 5);
        // 中部类型
        let types = await ctx.service.game.types();
        // 下方列表
        let gamelist = await ctx.service.game.lists('all', 1, 10);
        if(tag){
            return await ctx.render('home/staticGame', {
                header: header,
                types: types,
                games: gamelist
             });
        }else{
            return await ctx.render('home/game', {
                header: header,
                types: types,
                games: gamelist
             });
        }
        
    }

    async gametype(ctx){
        let id = ctx.params.typeid;
        if(!id){
            return;
        }
        let type = await ctx.app.model.Gametype.findById(id);
        if(!type) {
            return;
        }
        let games = await ctx.service.game.findByType(id);
        return await ctx.render('home/gametype', {
            typeName: type.name,
            games: games
        });
    }
}

module.exports = GameController;