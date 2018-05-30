module.exports = (options, app) => {
    return async function(ctx, next) {
        let { mac } = ctx.query;

        // 判断终端`MAC`是否已存在库中
        if (await ctx.model.Sta.existsMAC(mac)) {
            return await next();
        }

        return;
    };
};
