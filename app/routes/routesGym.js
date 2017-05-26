const express = require('express');
const routerGym = express.Router();
const gyms = require('../controller/controlGym');


const multer = require('multer');
const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './trash/images/gyms')
        }, filename: function (req, file, callback) {
            callback(null, Date.now() + '-' + file.originalname);
        }
    }),
    upload = multer({storage: storage}).single('photo');


routerGym.get('/' , function (req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end('Gyms json are working..')
});

routerGym.get('/gyms' ,gyms.getAllGyms);

routerGym.post('/createGym' ,upload ,gyms.createGym);

routerGym.post('/updateGym/:id' ,upload ,gyms.updateGym);

routerGym.delete('/deleteGym/:id' ,gyms.deleteGym);


module.exports = routerGym;
