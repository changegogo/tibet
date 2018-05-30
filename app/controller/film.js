const Controller = require('egg').Controller;

class FilmController extends Controller {
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
        let data = await ctx.service.film.lists(page, pageSize);
        ctx.body = {
            code: 200, 
            msg: '成功',
            data: data
        };
    }
}

module.exports = FilmController;