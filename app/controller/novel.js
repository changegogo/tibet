const Controller = require('egg').Controller;
const _ = require('lodash');
const request = require('request');

class NovelController extends Controller {
    async lists(ctx){
        //let conf = ctx.app.config;
        let model = ctx.app.model;
        let typeid = ctx.params.typeid;
        let { mac, tag } = ctx.query;
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
        if(tag){
            return await ctx.render('home/staticNovel', {
                mac: "",
                allType: allType,
                curType: typeid,
                novels: novels
             });
        }else{
            return await ctx.render('home/novel', {
                mac: mac,
                allType: allType,
                curType: typeid,
                novels: novels
             });
        }
        
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
}

module.exports = NovelController;