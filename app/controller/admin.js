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
            console.log(ctx.session);
            let { username, password } = ctx.request.body;
            if(username === 'admin' && password === '12345678') {
                ctx.session.username = username;
                ctx.body = {
                    code: 200,
                    msg: '登录成功'
                };
            }else {
                ctx.body = {
                    code: 201,
                    msg: '用户或密码不正确'
                };
            }
        }

        async logout(ctx) {
            ctx.session.username = null;
            ctx.body = {
                code: 200,
                msg: '登出成功'
            };
        }

        async statistics(ctx) {
            let { username } = ctx.session;
            if(username != 'admin') {
                ctx.body = {
                    code: 403,
                    msg: 'no login'
                };
            }else {
                let countObj = await model.Sta.statistics();
                ctx.body = {
                    code: 200,
                    ...countObj
                };
            }
           
        }
    }

    return Admin;
};
