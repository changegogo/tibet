const Controller = require('egg').Controller;

class UserController extends Controller {
    async unbind(ctx) {
        let { model } = ctx.app;
        let { mobile, mac } = ctx.request.body;
        let sta = await model.Sta.findByMacAndMobile(mobile, mac);
        if(sta) {
            let c = await model.Sta.unbindMac(mobile, mac);
            ctx.body = {
                code: 200,
                msg: 'success'
            }
        }else {
            ctx.body = {
                code: 201,
                mag: 'fail'
            }
        }
        
    }
}

module.exports = UserController;