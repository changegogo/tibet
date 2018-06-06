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
    app.get('/books/:type', 'home.books');
    app.get('/books/my', 'home.mybooks');
    app.get('/movies', 'home.movies');
    //app.get('/player/:name', 'home.player');
    app.get('/buy', 'home.buy');

    // 浮窗广告
    app.get('/adver', 'home.adv');
    // 资讯列表 :type 取值 normal notice
    app.get('/news/list/:type', 'news.typeList');
    // 游戏列表
    app.get('/game/list', 'game.lists');
    // 游戏分类
    app.get('/game/list/:typeid', 'game.gametype');
    // 小说列表
    app.get('/novel/list/:typeid', 'novel.lists');
    // 小说详情
    app.get('/novel/details/:id', 'novel.novedetails');
    // 我的小说列表
    app.get('/mynovel/list', 'mynovel.lists');
    // 列车影院
    app.get('/traincinema/list', 'film.trainCinema');
    // 电影详情
    app.get('/film/details/:id', 'film.details');
    // 播放电影
    app.get('/player/:id', 'home.player');
    // 我的电影
    app.get('/myfilm/list', 'myfilm.lists');
    // 天路wifi
    app.get('/tianluwifi', 'home.tianluwifi');
    // 购买流量
    app.get('/tianwifi/buy', 'home.tianluwifibuy');
    // 我的中心
    app.get('/mycenter', MIDDLE_WARES.isMtfi(), 'home.mycenter');
    // 已购买 type (novel,film,wifi)
    app.get('/alreadybuy/:type', 'home.alreadybuy');
    // 常见问题
    app.get('/problem', 'home.problem');
    // 意见反馈
    app.get('/advice', 'home.advice');

    //阅读器
    // app.get('/novelReader', 'home.novelReader');

    // 图片上传
    app.post('/upload', 'home.upload');

    // 支付相关
    app.post('/sell/msg', 'sell.commitSellMsg');
};
