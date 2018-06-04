/**
 * film service
 */
const Service = require('egg').Service;

class FilmService extends Service {
    async lists(type, page=1, pageSize=10) {
        const model = this.ctx.model;

        let films = await model.Film.findAllByTypeAndPage(type, page, pageSize);

        return films;
    }

    async getFileById(id) {
        const model = this.ctx.model;
        let film = await model.Film.findByIdFilm(id);
        return film;
    }
}

module.exports = FilmService;