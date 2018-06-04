/**
 * wifi service
 */
const Service = require('egg').Service;

class WifiService extends Service {
    async lists() {
        const model = this.ctx.model;

        let wifis = await model.Wifi.findAllByTypeAndPage();

        // 更改amount字段，为前端需要的字段
        wifis.map((wifi)=>{
            if(wifi.amount >= 1024){
                wifi.amount = Math.floor(wifi.amount / 1024) + 'GB';
            }else{
                wifi.amount = wifi.amount + 'MB';
            }
        });

        return wifis;
    }
}

module.exports = WifiService;