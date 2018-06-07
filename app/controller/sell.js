const Controller = require('egg').Controller;
const Alipay = require("alipay-node-sdk");

class SellController extends Controller {
    async commitSellMsg(ctx) {
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
        ctx.body =  await ctx.service.sell.commitSellMsg(shopType, shopId, mac);
    }

    async commitSellMsgAgin(ctx) {
        // 用户设备mac地址
        let mac = ctx.request.body.mac;
        if(!mac){
            return;
        }
        // 获取商品类型
        let shopType = ctx.request.body.shopType;
        if(!shopType) {
            return;
        }
        // 获取订单号码
        let tradeNumber = ctx.request.body.tradeNumber;
        if(!tradeNumber) {
            return;
        }

    }

    // 支付宝回调方法
    async callback(ctx){
        let model = ctx.app.model;
        let conf = ctx.app.config;

        let receive = ctx.request.body;
        console.log(JSON.stringify(receive));
        let trade_no = receive.trade_no;				//支付宝交易号
        let order_no = receive.out_trade_no;	        //获取订单号
        let total_amount = receive.total_amount;	    //获取总金额
        let subject = receive.subject;//商品名称、订单名称
        let body = "";
        if(receive.body != null){
            body = receive.body;//商品描述、订单备注、描述
        }
        let buyer_email = receive.buyer_email;		//买家支付宝账号
        let trade_status = receive.trade_status; //交易状态

        //支付宝回调
        // let ali = new Alipay({
        //     appId: '2017122001025887',
        //     notifyUrl: 'https://mobipromo.io/tibet/alipay/order/callback',
        //     returnUrl:'https://mobipromo.io/presale.html',
        //     rsaPrivate: path.resolve('./pem/sandbox_private.pem'),
        //     rsaPublic: path.resolve('./pem/sandbox_ali_public.pem'),
        //     sandbox: true,
        //     signType: 'RSA2'
        // });
        // let result = ali.signVerify(receive);
        let result = true;
        if(result){
            if(trade_status=="TRADE_FINISHED"){
                //注意：
                //该种交易状态只在两种情况下出现
                //1、开通了普通即时到账，买家付款成功后。
                //2、开通了高级即时到账，从该笔交易成功时间算起，过了签约时的可退款时限（如：三个月以内可退款、一年以内可退款等）后。
                console.log("TRADE_FINISHED");
                await updateShopSell(model, conf, subject, order_no,trade_no,total_amount);
            }else if(trade_status=="TRADE_SUCCESS"){
                //注意：
                //该种交易状态只在一种情况下出现——开通了高级即时到账，买家付款成功后。
                console.log("TRADE_SUCCESS");
                await updateShopSell(model, conf, subject, order_no,trade_no,total_amount);
            }
            ctx.body = "success";
        }else{
            ctx.body = "failure";
        }
    }
}

async function updateShopSell(model, conf, subject, order_no,trade_no,total_amount){
    if(subject === conf.subjects[0]){        // 流量
        // 查找订单
        //let mywifi = await model.Mywifi.findByTradeNumber(order_no);
        let order = await model.Order.findByTradeNumber(order_no);
        // 更新订单
        order.status = 'ok';
        order.purchasetype = 'zfb';  // 支付类型
        order.tradeNo = trade_no; // 交易号
        order.save();
    }else if(subject === conf.subjects[1]){  // 电影
        // 查找订单
        let myfilm = await model.Myfilm.findByTradeNumber(order_no);
        // 更新订单
        myfilm.status = 'ok';
        myfilm.purchasetype = 'zfb';  // 支付类型
        myfilm.tradeNo = trade_no; // 交易号
        myfilm.save();
    }else if(subject === conf.subjects[2]){  // 小说
        // 查找订单
        let mynovel = await model.Mynovel.findByTradeNumber(order_no);
        // 更新订单
        mynovel.status = 'ok';
        mynovel.purchasetype = 'zfb';  // 支付类型
        mynovel.tradeNo = trade_no; // 交易号
        mynovel.save();
    }else{

    }

}

module.exports = SellController;