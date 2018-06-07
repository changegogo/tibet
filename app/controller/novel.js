const Controller = require('egg').Controller;
const _ = require('lodash');

class NovelController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        let model = ctx.app.model;
        let typeid = ctx.params.typeid;
        let mac = ctx.query.mac;
        // 所有的类型
        let allType = await model.Noveltype.findAllNovel();
        // 选择的类型
        let curType = typeid;

        let has = _.find(allType, {id: Number(curType)});
        if(!has) {
            return;
        }
        // 类型下的小说
        let novels = await ctx.service.novel.lists(curType, 1, 10);
        return await ctx.render('home/novel', {
            mac: mac,
            allType: allType,
            curType: typeid,
            novels: novels
         });
    }

    async novedetails(ctx){
        let id = ctx.params.id;
        let mac = ctx.query.mac;
        let novel = await ctx.service.novel.findById(id);
        return await ctx.render('home/noveldetails', {
            mac: mac,
            novel: novel
        })
    }
}

module.exports = NovelController;