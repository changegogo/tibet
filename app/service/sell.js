/**
 * sell service
 */
const utils = require('../commonUtils/utils');
const Service = require('egg').Service;

class SellService extends Service {
    async commitSellMsg(shopType, shopId, mac) {
        const model = this.ctx.model;
        const conf = this.ctx.app.config;
        // 查询用户
        let {username} = await model.Sta.findByMAC(mac);
        if(!username) {
            return {
                isSuccess: false,
                msg: '非法操作'
            };
        }
        // 查询商品是否存在
        let shop = null;
        let myshop = null;
        switch(shopType) {
            case 'flow':
            shop = await model.Wifi.findByIdwifi(shopId);
            break;
            case 'film':
            shop = await model.Film.findByIdFilm(shopId);
            // 通过用户名和商品id查询是否已经购买了此产品
            myshop = await model.Myfilm.findByUserAndIdOk(username, shopId);
            break;
            case 'novel':
            shop = await model.Novel.findById(shopId);
            myshop = await model.Mynovel.findByUserAndIdOk(username, shopId);
            break;
            default:
            break;
        }
        if(!shop){
            return {
                isSuccess: false,
                msg: '购买的商品不存在'
            }
        }
        // 检测商品是否已经被购买
        if(myshop && myshop.status === 'ok'){
            return {
                isSuccess: false,
                msg: '您已经购买此商品,请去 我的->已购买 查看'
            }
        }
        // 生成订单号码
        let tradeNumber = utils.generateTradeNumber();
        let shopSell = {
            mac: mac,
            from: 'BUY',
            key: 'FLOW',
            val: Number(shop.amount)*1024*1024,
            tradeNumber: tradeNumber,
            username: username,
            shopId: shopId,
            totalRmb: shop.price,
            status: "wait"
        }
        // 根据不同的商品类型存入不同的表中
        let result = null;
        let subject = "";
        let description = "";
        switch(shopType) {
            case 'flow':
            // 写入订单，未支付
            //result = await model.Mywifi.insertData(shopSell);
            result = await model.Order.insertData(shopSell);

            subject = conf.subjects[0];
            description = `您已成功购买 ${shop.amount} 流量，打开访问开关即可成功访问外网`;
            break;
            case 'film':
            result = await model.Myfilm.insertData(shopSell);
            subject = conf.subjects[1];
            description = `您成功购买电影 ${shop.name},进入我的进行观看！`;
            break;
            case 'novel':
            result = await model.Mynovel.insertData(shopSell);
            subject = conf.subjects[2];
            description = `您成功购买小说 ${shop.name},进入我的进行阅读！`;
            break;
            default:
            break;
        }
        // 测试mac地址
        // || mac == '78:9f:70:32:81:ed'
        if(mac == 'b0:e2:35:74:50:57' || mac == '8c:85:90:cb:e6:26'){
            shop.price = '0.01';
        }
        // 获取支付链接
        let httpurl = "";
        httpurl = await this.service.alipay.getOrderAliPay(subject, description, tradeNumber, shop.price, mac);
        // if (conf.env === 'prod') {
        //     httpurl = await this.service.alipay.getOrderAliPay(subject, description, tradeNumber, shop.price);
        // }else{
        //     httpurl = 'https://openapi.alipay.com/gateway.do?'+'a=b';
        // }
        
        return {
            isSuccess: true,
            msg: '成功',
            httpurl: httpurl
        };

    }
}

module.exports = SellService;