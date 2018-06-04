/**
 * 我的流量service
 */
const Service = require('egg').Service;

class MyWifiService extends Service {
    async lists() {
        const model = this.ctx.model;

        let myWifis = await model.Mywifi.findAllMyWifi();
        myWifis.map((wifi)=>{
            if(wifi.amount >= 1024){
                wifi.amount = Math.floor(wifi.amount / 1024) + 'GB';
            }else{
                wifi.amount = wifi.amount + 'MB';
            }
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