/**
 * 我的小说service
 */
const Service = require('egg').Service;

class MyNovelService extends Service {
    async lists(mac) {
        const model = this.ctx.model;
        // 通过mac查找用户
        let { username } = await model.Sta.findByMAC(mac);
        let myNovels = await model.Mynovel.findAllMyNovel(username, 'ok');

        return myNovels;
    }

    async findById(id) {
        const model = this.ctx.model;
        let myNovel = await model.Mynovel.findByIdMyNovel(id);
        return myNovel;
    }
}

module.exports = MyNovelService;