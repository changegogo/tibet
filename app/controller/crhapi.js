const Controller = require('egg').Controller;

class CRHController extends Controller {
    async receive(ctx) {
        let model = ctx.app.model;
        let { mMac, wMac, ip, telphone } = ctx.query;
        // 参数校验
        if(!mMac || !wMac || !telphone) {
            return ctx.body = {
                code: 401,
                msg: '参数不正确'
            }
        }

        // 判断连接的是否未MTFI
        let mtfi =  await model.Mtfi.findByLickMac(wMac);
        if(!mtfi) {
            return ctx.body = {
                code: 401,
                msg: '请在列车WiFi上使用'
            }
        }
        let [sta, isNew] = await model.Sta.findOrGenerate(mtfi, telphone, mMac, ip);
        if(!isNew) {
            if(sta.mac != mMac) {
                return ctx.body = {
                    code: 401,
                    msg: '请在已绑定手机使用'
                }
            }
            // 更新sta中的mtfi信息
            await model.Sta.updateByTelphone(telphone, mtfi.gw_id, mtfi.gw_sn);
        }
        
        let url = `/wifi/login?mac=${sta.mac}&gw_id=${mtfi.gw_id}&gw_sn=${mtfi.gw_sn}&gw_address=${mtfi.gw_address}&gw_port=${mtfi.gw_port}&wifi=${mtfi.ssid}&tag=app&device=no&ip=${ip}`;
        ctx.redirect(url);
    }
}

module.exports = CRHController;