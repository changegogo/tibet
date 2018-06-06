/**
 * 我的流量service
 */
const Service = require('egg').Service;

class MyWifiService extends Service {
    async lists(mac) {
        const model = this.ctx.model;
        // 通过mac查找用户
        let { username } = await model.Sta.findByMAC(mac);
        let myWifis = await model.Mywifi.findAllMyWifi(username, 'ok');
        myWifis.map((wifi)=>{
            if(wifi.wifi.amount >= 1024){
                wifi.amount = Math.floor(wifi.wifi.amount / 1024) + 'GB';
            }else{
                wifi.amount = wifi.wifi.amount + 'MB';
            }
            wifi.price = wifi.wifi.price;
        })

        return myWifis;
    }

    async findById(id) {
        const model = this.ctx.model;
        let myWifi = await model.Mywifi.findByIdMyWifi(id);
        return myWifi;
    }
}

module.exports = MyWifiService;