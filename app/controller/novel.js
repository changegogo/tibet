const Controller = require('egg').Controller;

class NovelController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        let type = ctx.params.type;
        let novels = await ctx.service.novel.lists(type, 1, 10);
        return await ctx.render('home/novel', {
            type: type,
            novels: novels
         });
    }

    async details(ctx){
        let id = ctx.params.id;
        let novel = await ctx.service.novel.findById(id);
        return await ctx.render('home/novedetails', {
            novel: novel
        })
    }
}

module.exports = NovelController;