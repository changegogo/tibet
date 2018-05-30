module.exports = (options, app) => {
    return async function(ctx, next) {
        if (ctx.session.admin) {
            return await next();
        }

        const entrypoint = app.config.backendEntrypoint;

        // Ajax Request
        if (ctx.get("x-requested-with") === "XMLHttpRequest") {
            ctx.body = {
                code: 0,
                url: entrypoint
            };
            return;
        };

        ctx.redirect(entrypoint);
    };
};
