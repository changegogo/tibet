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
    // 获取全部游戏类型
    async types(){
        const model = this.ctx.model;
        let types = model.Game.types();
        return types;
    }

    async findByType(typeid){
        const model = this.ctx.model;
        let games = await model.Game.findByType(typeid);
        return games;
    }
}

module.exports = GameService;