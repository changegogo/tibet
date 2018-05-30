module.exports = app => {
    const MIDDLE_WARES = app.middlewares;
    const ADMIN_ENTRY_POINT = app.config.backendEntrypoint;

    // 用户认证
    // `WIFI`用户终端 -> `MTFi`锐捷路由设备 -> 远程认证服务器
    // ---------------------------------------------------

    // Step 1: 获取认证`token`
    app.get('/wifi/login', MIDDLE_WARES.isMtfi(), 'home.login');

    // Step 2: 根据`stage`参数
    //   1. login:      验证`token`
    //   2. counters:   用户追踪
    //   3. logout:     退出登录
    app.get('/wifi/auth', MIDDLE_WARES.isMtfi(),'home.auth');

    // 设备心跳信息
    app.get('/wifi/ping', ctx => {
        ctx.body = "Pong";
    });

    // 认证成功
    app.get('/wifi/portal', 'home.index');

    // 认识失败, 错误信息页面
    app.get('/wifi/gw_message.php', 'home.message');

    // 绑定手机号
    app.post('/signup', MIDDLE_WARES.isMtfi(), MIDDLE_WARES.isMobile(), MIDDLE_WARES.existsMac(), 'home.signup');

    // 发送短信验证码
    app.post('/smscode', MIDDLE_WARES.isMtfi(), MIDDLE_WARES.isMobile(), MIDDLE_WARES.existsMac(), 'home.smscode');

    // 后台管理
    // ---------------------------------------------------

    app.get(ADMIN_ENTRY_POINT, 'admin.index');
    app.post(ADMIN_ENTRY_POINT, 'admin.login');
    app.get('/logout/', 'admin.logout');
    app.get('/admin', 'admin.dashboard');
    app.get('/books', 'home.books');
    app.get('/books/my', 'home.mybooks');
    app.get('/movies', 'home.movies');
    app.get('/player/:name', 'home.player');
    app.get('/buy', 'home.buy');

    // 新闻管理
   app.get('/news/list', 'news.lists');
};
