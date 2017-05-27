const express = require('express');
const News = require('../models/newsFeed');
// news = News();

const multer = require('multer');
const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './trash/images/news')
        }, filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    }),
    upload = multer({storage: storage}).fields([{name: 'changePhoto', maxCount: 1}, {
        name: 'changeVideo',
        maxCount: 1
    }]);


const routerNews = express.Router();


routerNews.get('/news', function (req, res) {
    News.find({}, function (err, news) {
        if (err) throw err;
        return res.status(200).json(news);

    })
});


routerNews.post('/news/addNews', upload, function (req, res, next) {
        News.findOne({newsId: req.body.newsId}, function (err, news) {
            if (err) throw err;
            if (news) return res.status(409).end("News Id already exists");
            News.collection.insert(req.body, (err)).then((data)=>{
                if(err) throw err;
                res.status(201).json(data);
            })
        })
});


routerNews.post('/news/updateNew/:newsId', upload, function (req, res, next) {
    if (!req.params.newsId) return res.status(400).end("Invalid input");
    News.findOneAndUpdate({newsId: req.params.newsId}, {$set: req.body}, {new: true}, (err, news)=>{
        if (err) throw err;
        if (!news) return res.status(409).send('No such news with newsId: ' + req.params.newsId);
        res.status(201).end('News updated with newsId: ' + news.newsId);
    })
});



routerNews.delete('/news/delete/:newsId', function (req, res) {
    if (!req.params.newsId || req.params.newsId===null) return res.status(400).end("Invalid input");
    News.findOneAndRemove({newsId: req.params.newsId}, function (err, news) {
        if (err) throw err;
        if (!news) return res.status(409).send('No such news with newsId: ' + req.params.newsId);
        res.status(200).end('News deleted with newsId: ' + news.newsId);
    })
});



module.exports = routerNews;
