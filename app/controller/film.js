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
        let { mac, tag } = ctx.query;
        //  查询所有电影的类型
        let filmTypes = await model.Filmtype.findAllFilmType();
        
        // 3个头部轮播图电影
        let header = await ctx.service.film.lists('all', 1, 3);
        // 2个中间电影
        let middle = await ctx.service.film.lists('all', 1, 2);
        let allTypefilms = [];
        for(let i=0; i < filmTypes.length; i++){
            let filmType = filmTypes[i];
            allTypefilms.push({
                typeId: filmType.id,
                typeName: filmType.name,
                films: await ctx.service.film.lists(filmType.id, 1, 3)
            });
        }

        if(tag){
            return await ctx.render('home/staticTrainCinema', {
                mac: "",
                header: header,
                middle: middle,
                allTypeFilms: allTypefilms
            });
        }else{
            return await ctx.render('home/trainCinema', {
                mac: mac,
                header: header,
                middle: middle,
                allTypeFilms: allTypefilms
            });
        }
        
        
    }

    async details(ctx) {
        let model = ctx.app.model;
        let filmid = ctx.params.id;
        let {mac, wmac} = ctx.query;
        if(wmac){
            wmac = wmac.toLowerCase();
        }
        if(!mac){
            ctx.body = "mac地址不能为空";
            return;
        }
        let film = await model.Film.findByIdFilm(filmid);

        let config = ctx.app.config;
        let deploy = config.deploy;
        let deviceaddress = config.deviceaddress;
        if(deploy && wmac){
            let isDevice =  await model.Mtfi.findByLickMac(wmac);
            if(isDevice){
                film.httpurl = `${deviceaddress}${film.httpurl}`;
            }
        }

        return await ctx.render('home/filmdetails', {
            mac: mac,
            film: film
        });
    }

    async more(ctx){
        let { filmtype, typename} = ctx.params;
        if(!filmtype){
            ctx.body = "电影类型不能为空";
            return;
        }
        let mac = ctx.query.mac;
        if(!mac){
            ctx.body = "mac地址不能为空";
            return;
        }
       
        let films = await ctx.service.film.lists(filmtype, 1, 100);
        return await ctx.render('home/movietype', {
            mac: mac,
            typeName: typename,
            films: films
        });
    }
}

module.exports = FilmController;