/**
 * 我的小说service
 */
const Service = require('egg').Service;

class MyNovelService extends Service {
    async lists() {
        const model = this.ctx.model;

        let myNovels = await model.Mynovel.findAllMyNovel();

        return myNovels;
    }

    async findById(id) {
        const model = this.ctx.model;
        let myNovel = await model.Mynovel.findByIdMyNovel(id);
        return myNovel;
    }
}

module.exports = MyNovelService;