const express = require('express');
const routerExercises = express.Router();
const exercises = require('../controller/controlExercises');


routerExercises.get('/' , function (req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end('Programs json are working..')
});

routerExercises.get('/exercises' ,exercises.getAllExercises);

routerExercises.post('/createExercises', exercises.createExercises);

routerExercises.delete('/deleteExercises/:name', exercises.deleteExercise);

module.exports = routerExercises;
