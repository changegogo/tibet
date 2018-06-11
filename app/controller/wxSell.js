const Controller = require('egg').Controller;
const wxPay = require('../wx/wxpay');
const commonUtils = require('../commonUtils/utils');

class wxSellController extends Controller {
    async wxCommitSellMsg(ctx) {
        let conf = ctx.app.config;

        // 将订单插入自己数据库 todo
        // 用户设备mac地址
        let mac = ctx.request.body.mac;
        if(!mac){
            return;
        }
        // 购买的产品类型 flow(流量) film(电影) novel(小说)
        let shopType = ctx.request.body.type;
        if(!shopType){
            return;
        }
        // 产品信息id
        let shopId = ctx.request.body.id;
        if(!shopId){
            return;
        }


        //let { body, total_fee } = ctx.request.body;

        let attach = "23131256231"; // 此处的attach不能为空值 否则微信提示签名错误
        let mch_id = conf.wxmch_id; // 商户id
        let openid = conf.wxopenid; // 开放平台id
        let appid = conf.wxappid;   // 应用id
        let key = conf.wxkey;       // 微信api key
        let notify_url = conf.wxnotify_url; // 回调地址
        let tradeNumber = commonUtils.generateTradeNumber(); // 订单号

        //let body = ""; // 商品描述
        //let total_fee = ""; // 商品价格
        let {body, total_fee} = await ctx.service.wxSell.commitSellMsg(shopType, shopId, mac);

        wxPay.order(attach, body, mch_id, openid, appid, key, tradeNumber, total_fee, notify_url)
            .then((data) => {
                ctx.render('home.wxpay', {args: data});
            });
    }

    async wxCallback(ctx) {
        // 根wxPay据微信后台返回的数据，进行修改本地订单数据
        return wxPay.notify(ctx.request.body);
        //ctx.body = {};
    }
}

module.exports = wxSellController;