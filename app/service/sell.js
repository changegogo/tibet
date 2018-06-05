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
            return;
        }
        // 查询商品是否存在
        let shop = null;
        switch(shopType) {
            case 'flow':
            shop = await model.Wifi.findByIdwifi(shopId);
            break;
            case 'film':
            shop = await model.Film.findByIdFilm(shopId);
            break;
            case 'novel':
            shop = await model.Novel.findById(shopId);
            break;
            default:
            break;
        }
        if(!shop){
            return;
        }
        // 生成订单号码
        let tradeNumber = utils.generateTradeNumber();
        let shopSell = {
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
            result = model.Mywifi.insertData(shopSell);
            subject = conf.subjects[0];
            description = "购买: "+shop.amount;
            break;
            case 'film':
            result = model.Myfilm.insertData(shopSell);
            subject = conf.subjects[1];
            description = "购买: "+shop.name;
            break;
            case 'novel':
            result = model.MyNovel.insertData(shopSell);
            subject = conf.subjects[2];
            description = "购买: "+shop.name;
            break;
            default:
            break;
        }
        // 获取支付链接
        let httpurl = await this.service.alipay.getOrderAliPay(subject, description, tradeNumber, shop.price);
        return {
            httpurl: httpurl
        };

    }
}

module.exports = SellService;