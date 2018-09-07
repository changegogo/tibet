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

    // 下载页面
    app.get('/app/download', 'home.downloadApp');
    // 启动页广告
    app.get('/adver/splash', 'home.splashAdv');
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
    // 电影更多
    app.get('/film/more/:filmtype/:typename', 'film.more');
    // 播放电影
    app.get('/player/:id', 'home.playervideo');
    // 我的电影
    app.get('/myfilm/list', 'myfilm.lists');
    // 天路wifi购买界面
    app.get('/tianluwifi', 'home.tianluwifi');
    // 购买成功界面
    app.get('/buy/success', 'home.buysuccess');
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
    app.post('/advice/upload', 'home.upload');
    // 意见反馈
    app.post('/advice/commit', 'home.adviceCommit');
    // 支付宝支付相关
    app.post('/sell/msg', 'sell.commitSellMsg');
    // 未支付订单重新支付
    //app.post('sell/msg/agin', 'sell.commitSellMsgAgin')
    // 支付宝回调接口
    app.post('/sell/callback', 'sell.callback');
    // 微信支付相关
    app.post('/wx/sell/msg', 'wxSell.wxCommitSellMsg');
    // 微信支付回调
    app.post('/wx/notify', 'wxSell.wxCallback');
    // app访问接口
    app.get('/app/:wmac/:mmac/:wifi', 'home.appcontroller');
    // 旧版web页面游戏，小说，电影的跳转页面
    app.get('/novel/web', 'novel.novelWeb');
    app.get('/film/web', 'film.filmWeb');
    app.get('/game/web', 'game.gameWeb');
    // web页面观看电影
    app.get('/film/play', 'film.filmPlay');
    // app版本接口
    app.get('/app/version', 'version.ver');
    // ios端验证绑定发送验证码接口
    app.post('/iossmscode', MIDDLE_WARES.isMobile(), 'home.iossmscode');
    // ios端验证接口
    app.post('/iosVeryBind', MIDDLE_WARES.isMobile(), 'home.iosVeryBind');
    // ios端特定接口
    app.get('/ios/:wmac/:telphone/:wifiname', 'home.iosEntry');

    // 测试indexold
    //app.get('/indexold', 'home.indexold');
    
};
