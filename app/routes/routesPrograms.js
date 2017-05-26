const express = require('express');
const routerPrograms = express.Router();
const programs = require('../controller/controlPrograms');


routerPrograms.get('/' , function (req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end('Programs json are working..')
});

routerPrograms.get('/programs' ,programs.getAllPrograms);

routerPrograms.post('/createProgram', programs.createProgram);

routerPrograms.post('/updatePrograms/:id', programs.updateProgram);

routerPrograms.delete('/deletePrograms/:id', programs.deleteProgram);

module.exports = routerPrograms;
