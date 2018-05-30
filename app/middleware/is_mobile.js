module.exports = (options, app) => {
    return async function(ctx, next) {
        try {
            ctx.validate({
                "mobile": {
                    type: 'string',
                    format: /^(1[3456789][0-9]{9})$/
                }
            });
        } catch(err) {
            ctx.logger.error(err.message);
            // 需前端校验
            // 直接访问接口非法输入返回`404`
            return;
        }

        return await next();
    };
}
