const Controller = require('egg').Controller;

class VersionController extends Controller {
    async ver(ctx) {
        try {
            ctx.validate({
                "os": [ 'android', 'ios' ],
            }, ctx.query);
        } catch (error) {
            ctx.body = {
                code: 201,
                msg: "os invalid",
                ver: null
            };
            return;
        }
        let { os } = ctx.query;
        let model = ctx.app.model;

        let version = await model.Version.findByOs(os);
        ctx.body = {
            code: 200,
            msg: "success",
            ver: version
        };
    }
}

module.exports = VersionController;