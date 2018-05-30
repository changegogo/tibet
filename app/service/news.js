/**
 * 新闻service
 */
const Service = require('egg').Service;

class NewsService extends Service {
    async lists(page=1, pageSize=10) {
        const model = this.ctx.model;

        let newss = await model.News.findAllByPage(page, pageSize);
        let newss_plain = newss.map((news)=>{
            news = news.get({ plain: true })
            let date = news.created_at;
            date = new Date(date);
            let month = date.getMonth()+1;
            let day = date.getDay();
            let hour = date.getHours()>9?date.getHours():'0'+date.getHours();
            let minute = date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes();
            news.created_at = `${month}月${day}日 ${hour}:${minute}`
            return news;
        });

        return newss_plain;
    }
    // 分类型查询
    async listByType(type){
        const model = this.ctx.model;
        let newss = await model.News.findByType(type);
        return newss;
    }
}

module.exports = NewsService;