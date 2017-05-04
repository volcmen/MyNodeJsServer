var express = require('express');
var News = require('../models/newsFeed');
// news = News();

var multer  = require('multer');
var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './trash/images/news')
        }, filename: function (req, file, callback) {
            callback(null, Date.now()+'-'+file.originalname);
        }}),
    upload = multer({storage: storage}).fields([{name: 'changePhoto', maxCount: 1},{name: 'changeVideo', maxCount: 1}]);


var routerNews = express.Router();


routerNews.get('/news', function (req, res) {
    News.find({}, function (err, news) {
        if (err) throw err;

        return res.render('news.ejs');

    })
});


routerNews.route('/news/addNews')
    .get( function (req, res) {
        return res.render('addNews', {news: res.news})
    })
    .post(upload, function (req, res, next) {
        News.findOne({newsId: req.body.id}, function (err, news) {
            if (err) throw err;
            if (news) return res.status(400).end("News Id already exists");
            console.log('news!!:: ' +  JSON.stringify(news));
            var newnews = new News();
            newnews.newsId = req.body.changeId ? req.body.changeId : newnews.newsId;
            newnews.Title = req.body.changeTitle ? req.body.changeTitle : newnews.Title;
            newnews.newsStatus = req.body.newsStatus ? req.body.newsStatus : newnews.newsStatus;
            newnews.newsStatusIco = req.body.changeStatusIco ? req.body.changeStatusIco : newnews.newsStatusIco;
            newnews.dateOfPubl = req.body.changeDateOfPubl ? req.body.changeDateOfPubl : newnews.dateOfPubl;
            newnews.Description = req.body.changeDescription ? req.body.changeDescription : newnews.Description;
            newnews.Gym = req.body.changeGym ? req.body.changeGym : newnews.Gym;


            if (req.files.changePhoto || req.files.changeVideo) {
                newnews.Photo = req.files.changePhoto[0].filename ? req.files.changePhoto[0].filename : newnews.Photo;
                newnews.Video = req.files.changeVideo[0].filename ? req.files.changeVideo[0].filename : newnews.Video;
            }
            newnews.save();

        });

        return res.redirect('/news')
    });

routerNews.get('/api/news', function (req, res) {
    News.find({}, function (err, news) {
        if (err) throw err;
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(news));
    })
});


routerNews.post('/api/news/addNews', upload, function (req, res, next) {
        News.findOne({newsId: req.body.id}, function (err, news) {
            if (err) throw err;
            if (news) return res.status(400).end("News Id already exists");
            var newnews = new News();
            newnews.newsId = req.body.id ? req.body.id : newnews.newsId;
            newnews.Title = req.body.Title ? req.body.Title : newnews.Title;
            newnews.newsStatus = req.body.newsStatus ? req.body.newsStatus : newnews.newsStatus;
            newnews.newsStatusIco = req.body.StatusIco ? req.body.StatusIco : newnews.newsStatusIco;
            newnews.dateOfPubl = req.body.dateOfPubl ? req.body.dateOfPubl : newnews.dateOfPubl;
            newnews.Description = req.body.Description ? req.body.Description : newnews.Description;
            newnews.Gym = req.body.Gym ? req.body.Gym : newnews.Gym;


            if (req.files) {
                newnews.Photo = req.files.changePhoto[0].filename ? req.files.changePhoto[0].filename : newnews.Photo;
                newnews.Video = req.files.changeVideo[0].filename ? req.files.changeVideo[0].filename : newnews.Video;
            }
            newnews.save();

            res.writeHead(200, {"Content-Type": "multipart/form-data"});
            res.end(JSON.stringify(newnews));
        });

    });


routerNews.delete('/api/news/delete/:newsId', function (req, res) {
    News.findOneAndRemove({newsId: req.params.newsId}, function (err) {
        if (err) throw err;
         res.status(200).end('News deleted');
    })
});



module.exports = routerNews;
