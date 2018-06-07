/**
 * 我的流量service
 */
const Service = require('egg').Service;
const BN = require('bignumber.js');
const FLOW_UNIT = new BN(1024);
const FLOW_UNIT_SYM = [ 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB' ];

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
    // 兼容order表，查询流量购买信息
    async listsOrder(mac) {
        const model = this.ctx.model;
        let { username } = await model.Sta.findByMAC(mac);
        let orders = await model.Order.findAllOrder(username);
        console.log(orders);
        // 转化流量单位
        orders.map((order) => {
            let total = new BN(order.val);
            let units = 'B';
            for (let [ i, u ] in FLOW_UNIT_SYM) {
                let r = total.div(FLOW_UNIT.pow(new BN(i)));
                if (r.lte(100)) {
                    total = r.toFixed(1);
                    units = FLOW_UNIT_SYM[i];
                    break;
                }
            }
            order.amount = total + units;
            //order.units = units;
            order.price = order.totalRmb;
        });
        return orders;
    }

    async findById(id) {
        const model = this.ctx.model;
        let myWifi = await model.Mywifi.findByIdMyWifi(id);
        return myWifi;
    }
}

module.exports = MyWifiService;