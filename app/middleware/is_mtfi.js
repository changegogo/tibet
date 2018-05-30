module.exports = (options, app) => {
    return async function(ctx, next) {
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
                    format: /^([a-f0-9]{2}:){5}[a-f0-9]{2}$/
                }
            }, ctx.query);
        } catch (err) {
            ctx.logger.error(err);
            // 非法输入返回`404`
            return;
        }

        return await next();
    };
}
