const Controller = require('egg').Controller;

class NewsController extends Controller {
    async lists(ctx){
        try{
            ctx.validate({
                "page": {
                    type: "string"
                },
                "pageSize": {
                    type: "string"
                }
            }, ctx.query);
        }catch(err){
            ctx.logger.error(err);
            return;
        }
        let {page, pageSize} = ctx.query;
        page = Number(page);
        pageSize = Number(pageSize);
        if( Number.isNaN(page) || Number.isNaN(pageSize)){
            ctx.body = {
                code: 201,
                msg: '参数不正确'
            }
            return;
        }
        let data = await ctx.service.news.lists(page, pageSize);
        ctx.body = {
            code: 200, 
            msg: '成功',
            data: data
        };
    }

    async typeList(ctx){
        let type = ctx.params.type;
        let header = await ctx.service.news.lists(1, 4);
        let zlnews = await ctx.service.news.listByType(type);
        return await ctx.render('home/news', { 
            type: type,
            header: header,
            news: zlnews
         });
    }
}

module.exports = NewsController;