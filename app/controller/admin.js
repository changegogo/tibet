/**
 * TODO Implement
 */

module.exports = app => {
    const conf = app.config;
    const redis = app.redis;
    const model = app.model;

    class Admin extends app.Controller {
        async index(ctx) {
            return "admin/index";
        }

        async dashboard(ctx) {
            return "admin/dashboard";
        }

        async login(ctx) {
            return "admin/login";
        }

        async logout(ctx) {
            return "admin/logout";
        }

        async statistics(ctx) {
            let countObj = await model.Sta.statistics();
            ctx.body = {
                code: 200,
                ...countObj
            };
        }
    }

    return Admin;
};
