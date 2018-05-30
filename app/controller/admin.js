/**
 * TODO Implement
 */

module.exports = app => {
    const conf = app.config;
    const redis = app.redis;

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
    }

    return Admin;
};
