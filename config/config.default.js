const path = require('path');
  

module.exports = appInfo => {
    return {
        security: {
            csrf: false
        },
        keys: "asV!QSPcD#M6,QQHPct#@qBa3",
        session: {
            key: "wifi",
            maxAge: 7 * 24 * 3600 * 1000
        },
        sequelize: {
            dialect: 'postgres',
            database: 'tibetwifi',
            host: 'localhost',
            port: '5432',
            username: 'tibetwifi',
            password: 'ulptfpgkl',
            operatorsAliases: false
        },
        logger: {
            level: 'WARN'
        },
        middleware: [ "errorHandler", "saveSession", "isAuthenticated" ],
        isAuthenticated: {
            match: /^admin/
        },
        redis: {
            client: {
                host: "127.0.0.1",
                port: 6379,
                password: null,
                db: 1
            }
        },
        view: {
            defaultViewEngine: "nunjucks",
            defaultExtension: ".nj"
        },
        backendEntrypoint: "/6gerWVpB5aP7",
        cdnVersion: 1,
        maxFlowLimit: 50 * 1024 * 1024,

        FILM_LIST: {
            "fanghua": [ "芳华", "fanghua.mp4", "fanghua.jpg" ],
            "201805081041-01": [ "军师联盟(第一集)", "201805081041-01.mp4", "junshilianmeng.jpg" ],
            "201805081041-02": [ "军师联盟(第二集)", "201805081041-02.mp4", "junshilianmeng.jpg" ],
            "201805081041-03": [ "军师联盟(第三集)", "201805081041-03.mp4", "junshilianmeng.jpg" ],
            "201805081041-04": [ "军师联盟(第四集)", "201805081041-04.mp4", "junshilianmeng.jpg" ],
            "201805081041-06": [ "军师联盟(第六集)", "201805081041-06.mp4", "junshilianmeng.jpg" ],
            "201805081041-07": [ "军师联盟(第七集)", "201805081041-07.mp4", "junshilianmeng.jpg" ],
            "201805081041-08": [ "军师联盟(第八集)", "201805081041-08.mp4", "junshilianmeng.jpg" ],
            "201805081041-09": [ "军师联盟(第九集)", "201805081041-09.mp4", "junshilianmeng.jpg" ],
            "201805081041-10": [ "军师联盟(第十集)", "201805081041-10.mp4", "junshilianmeng.jpg" ],
            "201805081041-11": [ "军师联盟(第十一集)", "201805081041-11.mp4", "junshilianmeng.jpg" ],
            "201805081041-12": [ "军师联盟(第十二集)", "201805081041-12.mp4", "junshilianmeng.jpg" ],
            "201805081041-13": [ "军师联盟(第十三集)", "201805081041-13.mp4", "junshilianmeng.jpg" ],
            "201805081041-14": [ "军师联盟(第十四集)", "201805081041-14.mp4", "junshilianmeng.jpg" ],
            "201805081041-16": [ "军师联盟(第十六集)", "201805081041-16.mp4", "junshilianmeng.jpg" ]
        },

        BOOK_LIST: [
            [ "中欧旅行Let'sGo（第2版）", "letsgo" ],
            [ "卡尔·威特的教育", "201805090428-01" ],
            [ "少年演说家", "201805090428-02" ],
            [ "洛克菲勒写给儿子的信", "201805090428-03" ],
            [ "浪迹越南，穿行迷离时光", "201805090428-04" ],
            [ "爱的旅行", "201805090428-05" ],
            [ "畅游俄罗斯", "201805090428-06" ],
            [ "畅游加拿大", "201805090428-07" ],
            [ "畅游日本（第2版）", "201805090428-08" ],
            [ "畅游泰国", "201805090428-09" ],
            [ "畅游美国", "201805090428-10" ],
            [ "睡多睡少都是病", "201805090428-11" ],
            [ "稻盛和夫领导力12法则", "201805090428-12" ],
            [ "英国旅行Let'sGo（第四版）", "201805090428-13" ],
            [ "蒙台梭利早教经典", "201805090428-14" ],
        ],
        qzintroduce: "中国铁路青藏集团有限公司地处青藏高原东部中国铁路青藏集团有限公司地处青藏高原东部中国铁路青藏集团有限公司地处青藏高原东部中国铁路青藏集团有限公司地处青藏高原东部中国铁路青藏集团有限公司地处青藏高原东部中国铁路青藏集团有限公司地处青藏高原东部",
        bookIndex: "http://192.168.0.1/books.html",
        filmIndex: "http://192.168.0.1/movies.html",
        
        subjects: ["流量", "电影", "小说"]
    };
};
