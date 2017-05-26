const express = require('express');
const routerClients = express.Router();
const clients = require('../controller/controlClients');

const multer = require('multer');
const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './trash/images/clients')
        }, filename: function (req, file, callback) {
            callback(null, req.client._id + '-' + Date.now() + '-' + file.originalname);
        }
    }),
    upload = multer({storage: storage}).single('photo');



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.end('Not logged in');
}


routerClients.get('/' , function (req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end('Clients json are working..')
});

routerClients.post('/login', clients.l0g1nCl13nt);

routerClients.post('/register', upload, clients.cr34t3Cl13nt);

routerClients.get('/clients' ,clients.sh0wCl13nt2);

// routerClients.get('/profile', isLoggedIn ,clients.m3());

routerClients.get('/search/id/:id', clients.f1ndBy1D);

routerClients.get('/search/email/:email', clients.f1ndBy3m41l);

routerClients.post('/update/:email', upload, clients.upd4t3Cl13nt);

routerClients.delete('/delete/:email', clients.d3l3t3);


routerClients.post('/logout', function(req, res) {
    req.logout();
    res.end('Logged out')
});

module.exports = routerClients;