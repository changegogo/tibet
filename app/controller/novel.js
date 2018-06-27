const Controller = require('egg').Controller;
const _ = require('lodash');
const request = require('request');

class NovelController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        let model = ctx.app.model;
        let typeid = ctx.params.typeid;
        let { mac } = ctx.query;
        // 所有的类型
        let allType = await model.Noveltype.findAllNovel();
        // 选择的类型
        let curType = typeid;

        let has = _.find(allType, {id: Number(curType)});
        if(!has) {
            return;
        }
        // 类型下的小说
        let novels = await ctx.service.novel.lists(curType, 1, 10000);
        return await ctx.render('home/novel', {
            mac: mac,
            allType: allType,
            curType: typeid,
            novels: novels
        });
    }

    async novedetails(ctx){
        let model = ctx.app.model;
        let id = ctx.params.id;
        let {mac, wmac} = ctx.query;
        if(wmac){
            wmac = wmac.toLowerCase();
        }

        let novel = await ctx.service.novel.findById(id);
        // 请求盒子的某个资源，判断是否连接的是盒子 true 为连接的盒子，false为没有连接盒子
        let config = ctx.app.config;
        let deploy = config.deploy;
        let deviceaddress = config.deviceaddress;
        //let checkdeviceurl = config.checkdeviceurl;
        if(deploy && wmac){
            let isDevice =  await model.Mtfi.findByLickMac(wmac);
            if(isDevice){
                //novel.img = `${deviceaddress}${novel.img}`;
                novel.httpurl = `${deviceaddress}${novel.httpurl}`;
            }
        }

        return await ctx.render('home/noveldetails', {
            mac: mac,
            novel: novel
        })
    }
    // web页面查询全部小说
    async novelWeb(ctx) {
        // Referer
        let referer = ctx.header.referer;
        let novels = await ctx.service.novel.lists('all', 1, 100);
        return await ctx.render('home/staticNovel', {
            novels: novels,
            referer: referer
         });
    }
}

module.exports = NovelController;