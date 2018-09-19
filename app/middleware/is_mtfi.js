module.exports = (options, app) => {
    return async function(ctx, next) {
        // 表示连接的不是MTFI
        let { device } = ctx.query;
        if(device === 'no') {
            return await next();
        }
        ctx.query = Object.assign({}, ctx.query, ctx.session);
        try {
            ctx.validate({
               "gw_id": {
                    type: 'string',
                    format: /^([A-F0-9]{2}:){5}[A-F0-9]{2}$/
                },
                "gw_sn": {
                    type: 'string',
                    format: /^[A-Z0-9]{16}$/
                },
                "ip": {
                    type: 'string',
                    format: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
                },
                "mac": {
                    type: 'string',
                    format: /^([a-fA-F0-9]{2}:){5}[a-fA-F0-9]{2}$/
                }
            }, ctx.query);
        } catch (err) {
            ctx.logger.error(err);
            // 非法输入返回`404`
            return;
        }
        ctx.query.mac = ctx.query.mac.toLowerCase();
        return await next();
    };
}
