/**
 * 我的电影
 */
const Controller = require('egg').Controller;
const _ = require('lodash');

class MyFilmController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        let model = ctx.app.model;
        
        // 类型下的小说
        let myFilms = await ctx.service.myfilm.lists();
        return await ctx.render('home/myfilms', {
            films:  myFilms
         });
    }
}

module.exports = MyFilmController;