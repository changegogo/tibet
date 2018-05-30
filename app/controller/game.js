const Controller = require('egg').Controller;

class GameController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        let header = ctx.service.game.lists('all', 1, 3);
        let gamelist = ctx.service.game.lists('all', 1, 10);
        return await ctx.render('home/game', {
            header: header,
            news: gamelist
         });
    }
}

module.exports = GameController;