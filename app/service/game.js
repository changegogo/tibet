/**
 * 游戏service
 */
const Service = require('egg').Service;

class GameService extends Service {
    async lists(type, page=1, pageSize=10) {
        const model = this.ctx.model;

        let games = await model.Game.findAllByTypeAndPage(type, page, pageSize);

        return games;
    }
}

module.exports = GameService;