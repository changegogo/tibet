insert into filmtypes 
(id, name, created_at, updated_at)
values
(1, '战争', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(2, '恐怖', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(3, '动作', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08');

insert into films
(id, pos, name, imgh, imgv, director, tostar, description, httpurl, filmtype_id, score, price, created_at, updated_at)
values
(1, 'normal', '寂静之地', '/public/img/1.png', '/public/upload/film.png', '安东尼', '苏打粉', '《复仇者联盟3：', '/public/movies/demo.mp4', 1, '1', '10.0', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(2, 'normal', '逃出绝命镇', '/public/img/1.png', '/public/upload/film.png', '安东尼', '苏打粉', '《复仇者联盟3影宇宙的第十九部电影', '/public/movies/demo.mp4', 2, '2', '20.0', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(3, 'normal', '釜山行', '/public/img/1.png', '/public/upload/film.png', '安东尼', '苏打粉', '《复仇者联盟3：无限战争》九部电影，该片与《雷神3：诸', '/public/movies/demo.mp4', 3, '3', '10.0', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(4, 'normal', '黑皮戏', '/public/img/1.png', '/public/upload/film.png', '安东尼', '苏打粉', '《复仇者联盟3：无限战争》', '/public/movies/demo.mp4', 1, '4', '20.0', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(5, 'normal', '千与千寻', '/public/img/1.png', '/public/upload/film.png', '安东尼', '苏打粉', '《复仇者联盟3：无限战争》是由漫威电影制作的的科幻片。', '/public/movies/demo.mp4', 2, '5', '20.9', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(6, 'normal', '贼巢', '/public/img/1.png', '/public/upload/qyqx.png', '宫崎骏', '柊瑠美', '《千与千寻》是宫崎骏执导、编剧，吉卜力工作室制作的动画电影，', '/public/movies/qyqx.mp4', 1, '1', '10.0', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(7, 'normal', '泯灭', '/public/img/1.png', '/public/upload/film.png', '安东尼', '苏打粉', '《复仇者联盟3：无限战争》', '/public/movies/demo.mp4', 3, '1', '20.8', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08'),
(8, 'normal', '寂静之地', '/public/img/1.png', '/public/upload/film.png', '安东尼', '苏打粉', '《复仇者联盟3：无限战争》', '/public/movies/demo.mp4', 1, '2', '9.8', '2018-06-13 10:43:00+08', '2018-06-13 10:43:00+08');

insert into gametypes
(id, name, created_at, updated_at)
values
(1, '塔防', '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08'),
(2, '挂机', '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08'),
(3, '卡牌', '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08'),
(4, '休闲', '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08');

insert into games
(id, name, description, imgsmall, imgbig, httpurl, gametype_id, created_at, updated_at)
values
(1, '守卫公主', '这个游戏很好玩', '/public/upload/20180611/shouweigongzhusmal.png', '/public/upload/20180611/shouweigongzhubig.png', 'http://g.ibeargame.com/enter-229?referer=yyxpcs', 1, '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08'),
(2, '决战沙城', '这个游戏很好玩', '/public/upload/20180611/juezhanshachengsmall.png', '/public/upload/20180611/juezhanshachengbig.png', 'http://www.shandw.com/mi/game/1247433539.html?channel=10656', 2, '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08'),
(3, '一代宗师-大武林', '这个游戏很好玩', '/public/upload/20180611/dawulinsmall.png', '/public/upload/20180611/dawulinbig.png', 'http://www.shandw.com/mi/game/1497651795.html?channel=10656&sdw_dl=1&sdw_qd=1', 3, '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08'),
(4, '西游七十二变', '这个游戏很好玩', '/public/upload/20180611/xiyouqishierbiansmall.png', '/public/upload/20180611/xiyouqishierbiandw.png', 'http://game.fire2333.com/home/ac?action=/home/game/a/2034/g/100389/pt/9556', 1, '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08'),
(5, '侠客行', '这个游戏很好玩', '/public/upload/20180611/xiakexingsmall.png', '/public/upload/20180611/xiakexingbig.png', 'http://gc.hgame.com/home/game/appid/102303/gameid/100365/sr/2', 2, '2018-06-13 10:10:10+08', '2018-06-13 10:10:10+08');

insert into noveltypes
(id, name, created_at, updated_at)
values
(1, '旅行', '2018-06-01 10:10:10+08','2018-06-01 10:10:10+08'),
(2, '美食', '2018-06-02 10:10:10+08','2018-06-02 10:10:10+08'),
(3, '风景', '2018-06-03 10:10:10+08','2018-06-03 10:10:10+08'),
(4, '情感', '2018-06-04 10:10:10+08','2018-06-04 10:10:10+08');

insert into novels
(id, name, author, img, description, httpurl, noveltype_id, price, isfree, created_at, updated_at)
values
(1, '埃及旅行', '杨振东', '/public/novels/novel.jpg', '本书是微博上最会写故事的人张嘉佳献给你的心动故事。最初以“睡前故事”系列的名义在网上疯狂流传，几天内达到1,500,000次转发，超4亿次阅读，引来电影投资方的巨资抢购，转瞬便签下其中5个故事的电影版权。读过睡前故事的人会知道，这是一本纷杂凌乱的书。像朋友在深夜跟你在叙述，叙述他走过的千山万水。那么多篇章，有温暖的，有明亮的，有落单的，有疯狂的，有无聊的，有胡说八道的。当你辗转失眠时，当你需要安慰时，当你等待列车时，当你赖床慵懒时，当你饭后困顿时，应该都能找到一章合适的。我希望写一本书，你可以留在枕边、放', '/public/upload/wljs.epub', 1, '9.0', 'pay', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08'),
(2, '巴西旅行', '耳根', '/public/novels/novel.jpg', '这是小说描述', '/public/upload/wljs.epub', 1, '10.0', 'pay', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08'),
(3, '波兰捷克斯洛伐克', '尤瓦尔·赫拉利', '/public/novels/novel2.jpg', '这是小说描述', '/public/upload/wljs.epub', 1, '0.0', 'free', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08'),
(4, '巴西旅行', '耳根', '/public/novels/novel2.jpg', '这是小说描述', '/public/upload/wljs.epub', 1, '0.0', 'free', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08');

insert into wifis
(id, status, amount, price, created_at, updated_at)
values
(1, 'stockup', '500', '5.0', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08'),
(2, 'sell', '1024', '10.0', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08'),
(3, 'sell', '2048', '15.0', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08'),
(4, 'sell', '3072', '20.0', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08'),
(5, 'sell', '4096', '25.0', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08'),
(6, 'sell', '10240', '30.0', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08');

insert into news
(id, title, description, img_1, img_2, img_3, content, httpurl, created_at, updated_at, type)
values
(1, '新闻题目', '天上西藏 桃花秘境 信仰的震撼（林芝-然乌-波密-拉萨七日游）', '/public/img/1.png', '/public/img/1.png', '/public/img/1.png', '新闻内容', 'https://xw.qq.com/tech/20180613018749/TEC2018061301874900', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08','normal'),
(2, '新闻题目', '天上西藏 桃花秘境 信仰的震撼（林芝-然乌-波密-拉萨七日游）', '/public/img/1.png', '/public/img/1.png', '/public/img/1.png', '新闻内容', 'https://xw.qq.com/tech/20180613018749/TEC2018061301874900', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08','notice'),
(3, '新闻题目', '天上西藏 桃花秘境 信仰的震撼（林芝-然乌-波密-拉萨七日游）', '/public/img/1.png', '/public/img/1.png', '/public/img/1.png', '新闻内容', 'https://xw.qq.com/tech/20180613018749/TEC2018061301874900', '2018-06-01 10:10:10+08', '2018-06-01 10:10:10+08','normal');
