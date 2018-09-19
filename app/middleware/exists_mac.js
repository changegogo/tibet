module.exports = (options, app) => {
    return async function(ctx, next) {
        let { mac } = ctx.query;

        if(mac == '02:00:00:00:00:00') {
            ctx.status = 400;
            return ctx.body = {
                "message": "请连接wifi使用"
            };
        }

        // 判断终端`MAC`是否已存在库中
        if (await ctx.model.Sta.existsMAC(mac)) {
            return await next();
        }else {
            await ctx.model.Sta.updateByMAC(mac, '', '', '', true);
            return await next();
        }
    };
};
