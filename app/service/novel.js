/**
 * 小说service
 */
const Service = require('egg').Service;

class NovelService extends Service {
    async lists(type, page=1, pageSize=10) {
        const model = this.ctx.model;

        let novels = await model.Novel.findAllByTypeAndPage(type, page, pageSize);

        return novels;
    }

    async findById(id) {
        const model = this.ctx.model;
        let novel = await model.Novel.findById(id);
        return novel;
    }
}

module.exports = NovelService;