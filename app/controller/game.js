const Controller = require('egg').Controller;

class GameController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        let header = await ctx.service.game.lists('all', 1, 3);
        let gamelist = await ctx.service.game.lists('all', 1, 10);
        return await ctx.render('home/game', {
            header: header,
            games: gamelist
         });
    }
}

module.exports = GameController;