/**
 * ali支付业务
 */
const Alipay = require("alipay-node-sdk");
const path = require("path");
const Service = require('egg').Service;

class AlipayService extends Service {
    async getOrderAliPay(subject, description, myoutTradeId, allrmb){
        let ali = new Alipay({
            appId: '2017122001025887',
            notifyUrl: 'https://mobipromo.io/tibet/alipay/order/callback',
            returnUrl:'https://mobipromo.io/presale.html',
            rsaPrivate: path.resolve('./pem/sandbox_private.pem'),
            rsaPublic: path.resolve('./pem/sandbox_ali_public.pem'),
            sandbox: true,
            signType: 'RSA2'
        });
        
        var params = ali.wapPay({
            subject: subject,
            body: description,
            outTradeId: myoutTradeId,
            timeout: '1d',
            amount: allrmb,
            goodsType: '0'
        });
        console.log(params);
    
        let url_API = 'https://openapi.alipay.com/gateway.do?'+params;
        return url_API;
    }

    async query(myoutTradeId){
        let ali = new Alipay({
            appId: '2017122001025887',
            rsaPrivate: path.resolve('./pem/sandbox_private.pem'),
            rsaPublic: path.resolve('./pem/sandbox_ali_public.pem'),
            sandbox: false,
            signType: 'RSA2'
        });
        let result = ali.query({
            outTradeId: myoutTradeId    //商户网站唯一订单号
        });
    
        return result;
    };

    async refund(type, sell) {
        let outTradeNo = sell.tradeNumber,
            refundAmount = sell.totalRmb,
            tradeNo = sell.tradeNo;
        let ali = new Alipay({
            appId: '2017122001025887',
            notify_url: 'https://mobipromo.io/promo/alipay/order/callback',
            return_url:'https://mobipromo.io/presale.html',
            rsaPrivate: path.resolve('./pem/sandbox_private.pem'),
            rsaPublic: path.resolve('./pem/sandbox_ali_public.pem'),
            sandbox: false,
            signType: 'RSA2'
        });
    
        return ali.refund({
            outTradeId: outTradeNo,
            tradeId: tradeNo,
            refundAmount: refundAmount
        });
    
    }
}


module.exports = AlipayService;