const Exercises = require('../models/exercises');

module.exports = {};


module.exports.getAllExercises = function (req, res) {
    Exercises.find({}, function (err, exercises) {
        if (err) throw err;
        else {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(exercises));
        }
    })
};

module.exports.createExercises = function (req, res) {
    Exercises.findOne({name: req.body.name}, function (err, exercise) {
        if (err) throw err;
        if (exercise) return res.status(400).end("There is already exercise with name: " + exercise.name);
        else {
            Exercises.collection.insert(req.body, (err)).then((data)=>{
                if(err) throw err;
                res.writeHead(200, {"Content-Type": "application/json"});
                res.status(201).end(JSON.stringify(data));
            })
        }
    })
};

module.exports.deleteExercise = function (req, res) {
    if (!req.body.programID) return res.status(400).end("Invalid input");
    Exercises.findOneAndRemove({name: req.params.name}, function (err, exercise) {
        if (err) throw err;
        res.status(200).end('Exercise deleted with name: ' + exercise.name);
    })
};