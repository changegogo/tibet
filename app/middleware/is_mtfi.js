module.exports = (options, app) => {
    return async function(ctx, next) {
        ctx.query = Object.assign({
            ip: "192.168.0.51",
            gw_address: "192.168.255.1",
            gw_id: "58:69:6C:ED:EF:10",
            gw_port: "2060",
            gw_sn: "HMAPA04170500534"
        }, ctx.query);

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
                    //format: /[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/
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
