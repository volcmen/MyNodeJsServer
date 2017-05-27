const Exercises = require('../models/exercises');

module.exports = {};


module.exports.getAllExercises = function (req, res) {
    Exercises.find({}, function (err, exercises) {
        if (err) throw err;
        else {
            res.send(JSON.stringify(exercises));
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
                res.status(201).send(JSON.stringify(data));
            })
        }
    })
};

module.exports.updateExercise = (req, res) =>{
    if (!req.params.name) return res.status(400).end("Invalid input");
    Exercises.findOneAndUpdate({name: req.params.name}, {$set: req.body}, {new: true}, (err, exercise)=>{
        if (err) throw err;
        if (!exercise) return res.status(409).send('No such exercise: ' + req.params.name);
        res.status(200).end('Exercise updated with name: ' + exercise.name);
    })
};


module.exports.deleteExercise = function (req, res) {
    if (!req.params.name || req.params.name===null) return res.status(400).end("Invalid input");
    Exercises.findOneAndRemove({name: req.params.name}, function (err, exercise) {
        if (err) throw err;
        if (!exercise) return res.status(409).send('No such exercise: ' + req.params.name);
        res.status(200).send('Exercise deleted with name: ' + exercise.name);
    })
};