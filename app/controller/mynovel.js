/**
 * 我的小说
 */
const Controller = require('egg').Controller;
const _ = require('lodash');

class MyNovelController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        //let model = ctx.app.model;
        
        // 我的小说
        let myNovels = await ctx.service.mynovel.lists();
        return await ctx.render('home/mynovels', {
            novels:  myNovels
         });
    }
}

module.exports = MyNovelController;