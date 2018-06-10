const Controller = require('egg').Controller;
const wxPay = require('../wx/wxpay');
const commonUtils = require('../commonUtils/utils');

class wxSellController extends Controller {
    async wxCommitSellMsg(ctx) {
        let { body, total_fee } = ctx.request.body;
        let attach = "23131256231";
        let mch_id = '111111'; // 商户id
        let openid = '11111'; // 开放平台id
        let bookingNo = commonUtils.generateTradeNumber(); // 订单号
        let notify_url = 'http://localhost/wx/notify'; // 回调地址
        // 将订单插入自己数据库 todo
        
        wxPay.order(attach, body, mch_id, openid, bookingNo, total_fee, notify_url)
            .then((data) => {
                ctx.render('home.wxpay', {args: data});
            })
    }

    async wxCallback(ctx) {
        ctx.body = {};
    }
}

module.exports = wxSellController;