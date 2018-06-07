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

    async trainCinema(ctx){
        let model = ctx.app.model;
        let mac = ctx.query.mac;
        //  查询所有电影的类型
        let filmTypes = await model.Filmtype.findAllFilmType();
        
        // 3个头部轮播图电影
        let header = await ctx.service.film.lists('all', 1, 3);
        // 2个中间电影
        let middle = await ctx.service.film.lists('all', 1, 2);
        // 3个动作电影
        let type1 = '';
        let action = [];
        if(filmTypes.length>0 && filmTypes[0]){
            type1 = filmTypes[0].name;
            action = await ctx.service.film.lists(filmTypes[0].id, 1, 3);
        }
        
        // 3个恐怖电影
        let type2 = '';
        let terror = [];
        if(filmTypes.length>0 && filmTypes[1]){
            type2 = filmTypes[1].name;
            terror = await ctx.service.film.lists(filmTypes[1].id, 1, 3);
        }
        
        return await ctx.render('home/trainCinema', {
            mac: mac,
            header: header,
            middle: middle,
            type1: type1,
            action: action,
            type2: type2,
            terror: terror
        });
    }

    async details(ctx) {
        let model = ctx.app.model;
        let filmid = ctx.params.id;
        let mac = ctx.query.mac;

        let film = await model.Film.findByIdFilm(filmid);
        return await ctx.render('home/filmdetails', {
            mac: mac,
            film: film
        });
    }
}

module.exports = FilmController;