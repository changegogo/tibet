/**
 * 我的电影service
 */
const Service = require('egg').Service;

class MyFilmService extends Service {
    async lists() {
        const model = this.ctx.model;

        let myFilms = await model.Myfilm.findAllMyFilm();

        return myFilms;
    }

    async findById(id) {
        const model = this.ctx.model;
        let myFilm = await model.Mynovel.findByIdMyFilm(id);
        return myFilm;
    }
}

module.exports = MyFilmService;