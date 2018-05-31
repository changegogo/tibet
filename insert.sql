-- 新闻
INSERT INTO public.news (title, description, img_1, img_2, img_3, httpurl, created_at, updated_at, type)
VALUES
("第一次见哈士奇在哭，好委屈", "被外面狗子打了，第一次见哈士奇在哭，好委屈", "/public/upload/1.png", "/public/upload/1.png", "/public/upload/1.png", "http://gif.sina.com.cn/","2018-05-31 10:04:00", "2018-05-31 10:04:00", "normal"),
("第一次见哈士奇在哭，好委屈", "被外面狗子打了，第一次见哈士奇在哭，好委屈", "/public/upload/1.png", "/public/upload/1.png", "/public/upload/1.png", "http://gif.sina.com.cn/","2018-05-31 10:04:00", "2018-05-31 10:04:00", "normal"),
("第一次见哈士奇在哭，好委屈", "被外面狗子打了，第一次见哈士奇在哭，好委屈", "/public/upload/1.png", "/public/upload/1.png", "/public/upload/1.png", "http://gif.sina.com.cn/","2018-05-31 10:04:00", "2018-05-31 10:04:00", "notice"),
("第一次见哈士奇在哭，好委屈", "被外面狗子打了，第一次见哈士奇在哭，好委屈", "/public/upload/1.png", "/public/upload/1.png", "/public/upload/1.png", "http://gif.sina.com.cn/","2018-05-31 10:04:00", "2018-05-31 10:04:00", "normal"),
("第一次见哈士奇在哭，好委屈", "被外面狗子打了，第一次见哈士奇在哭，好委屈", "/public/upload/1.png", "/public/upload/1.png", "/public/upload/1.png", "http://gif.sina.com.cn/","2018-05-31 10:04:00", "2018-05-31 10:04:00", "notice"),
("第一次见哈士奇在哭，好委屈", "被外面狗子打了，第一次见哈士奇在哭，好委屈", "/public/upload/1.png", "/public/upload/1.png", "/public/upload/1.png", "http://gif.sina.com.cn/","2018-05-31 10:04:00", "2018-05-31 10:04:00", "normal"),
("第一次见哈士奇在哭，好委屈", "被外面狗子打了，第一次见哈士奇在哭，好委屈", "/public/upload/1.png", "/public/upload/1.png", "/public/upload/1.png", "http://gif.sina.com.cn/","2018-05-31 10:04:00", "2018-05-31 10:04:00", "notice"),
("第一次见哈士奇在哭，好委屈", "被外面狗子打了，第一次见哈士奇在哭，好委屈", "/public/upload/1.png", "/public/upload/1.png", "/public/upload/1.png", "http://gif.sina.com.cn/","2018-05-31 10:04:00", "2018-05-31 10:04:00", "normal")
-- 电影
-- 小说
-- 游戏

INSERT INTO public.gametypes (name, created_at, updated_at)  
VALUES 
('动作', '2018-05-30 10:10:10', '2018-05-30 10:10:10'),
('策略', '2018-05-30 10:10:10', '2018-05-30 10:10:10'),
('卡牌', '2018-05-30 10:10:10', '2018-05-30 10:10:10')

INSERT INTO public.games(name, description, imgsmall, imgbig, httpurl, gametype_id, created_at, updated_at)
VALUES
('纪念碑谷1', '这个游戏很好玩', '/public/img/1.png', '/public/img/1.png', '/public/img/1.png', 1, '2018-05-30 10:10:10', '2018-05-30 10:10:10'),
('纪念碑谷2', '这个游戏很好玩', '/public/img/1.png', '/public/img/2.png', '/public/img/1.png', 2, '2018-05-30 10:10:10', '2018-05-30 10:10:10'),
('纪念碑谷3', '这个游戏很好玩', '/public/img/1.png', '/public/img/3.png', '/public/img/1.png', 3, '2018-05-30 10:10:10', '2018-05-30 10:10:10'),
('纪念碑谷4', '这个游戏很好玩', '/public/img/1.png', '/public/img/1.png', '/public/img/1.png', 1, '2018-05-30 10:10:10', '2018-05-30 10:10:10'),
('纪念碑谷5', '这个游戏很好玩', '/public/img/1.png', '/public/img/2.png', '/public/img/1.png', 2, '2018-05-30 10:10:10', '2018-05-30 10:10:10'),
('纪念碑谷6', '这个游戏很好玩', '/public/img/1.png', '/public/img/3.png', '/public/img/1.png', 3, '2018-05-30 10:10:10', '2018-05-30 10:10:10'),
('纪念碑谷7', '这个游戏很好玩', '/public/img/1.png', '/public/img/1.png', '/public/img/1.png', 1, '2018-05-30 10:10:10', '2018-05-30 10:10:10')