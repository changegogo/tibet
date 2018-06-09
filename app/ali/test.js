const Alipay = require("./alipay");
const path = require("path");

let receive = {
    "gmt_create":"2018-06-08 20:19:53",
    "charset":"utf-8",
    "seller_email":"wuch@3etimes.com",
    "subject":"电影",
    "sign":"SuvFXFfBWUBcadgXIX9cSOLOocnKArJIyd/J7dM4aFEYHe1Ic0jtyVfeLZMzp+vi3ZYywsG5vQTHWVxkhPv2edyDOsbN7rLnHAaf5FgHkMmGK+c7GC5oj/UmPTExNirICe8OBaTTADNl9isJENMD/5FGBvQ7C+POIVypEyzqU5YGFTLcJmzoqokkzGwJau/xZWkc25OBtgTD99peK/44js8gtg1lz1kLPI2WE6uMhu0O6zYER5heuYxm01xeOLCo8PjlVEUcCIhzrJ7Rut6d8jFTNPCgkbki6PGGs7/7ntOZZcV4KSd75pUF3OxHPUEmlHgUjaCWO4PBJ3vC8CvL6A==",
    "body":"购买: 黑皮书",
    "buyer_id":"2088512408390233",
    "invoice_amount":"0.01",
    "notify_id":"e88f4f327573f4db21501ce6ea29adchs1",
    "fund_bill_list":"[{\"amount\":\"0.01\",\"fundChannel\":\"ALIPAYACCOUNT\"}]",
    "notify_type":"trade_status_sync",
    "trade_status":"TRADE_SUCCESS",
    "receipt_amount":"0.01",
    "buyer_pay_amount":"0.01",
    "app_id":"2018060860318901",
    "sign_type":"RSA2",
    "seller_id":"2088421888069435",
    "gmt_payment":"2018-06-08 20:19:54",
    "notify_time":"2018-06-08 20:23:49",
    "version":"1.0",
    "out_trade_no":"201806082019311528460371844",
    "total_amount":"0.01",
    "trade_no":"2018060821001004230573191493",
    "auth_app_id":"2018060860318901",
    "buyer_logon_id":"153****0596",
    "point_amount":"0.00"
};
try {
    let ali = new Alipay({
        appId: '2018060860318901',
        notifyUrl: 'http://39.104.66.16:7001/sell/callback',
        rsaPrivate: path.resolve('./pem/sandbox_private.txt'),
        rsaPublic: path.resolve('./pem/sandbox_ali_public.txt'),
        sandbox: false,
        signType: 'RSA'
    });
    console.log('ali-->');
    console.log(ali);
    let result = ali.signVerify(receive);
    console.log('结果-->'+result);
} catch (error) {
    console.log(error);
}


module.exports = Alipay;