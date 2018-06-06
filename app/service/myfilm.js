/**
 * 我的电影service
 */
const Service = require('egg').Service;

class MyFilmService extends Service {
    async lists(mac) {
        const model = this.ctx.model;
        // 通过mac查找用户
        let { username } = await model.Sta.findByMAC(mac);
        let myFilms = await model.Myfilm.findAllMyFilm(username, 'ok');
        return myFilms;
    }

    async findById(id) {
        const model = this.ctx.model;
        let myFilm = await model.Mynovel.findByIdMyFilm(id);
        return myFilm;
    }
}

module.exports = MyFilmService;