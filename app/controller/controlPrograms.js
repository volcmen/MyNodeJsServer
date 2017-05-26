const Programs = require('../models/programs');

module.exports = {};

module.exports.getAllPrograms = function (req, res) {
    Programs.find({}, function (err, programs) {
        if (err) throw err;
        else {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(programs));
        }
    })
};


module.exports.createProgram = function (req, res) {
    if (!req.body.programID) return res.status(400).end("Invalid input");
    Programs.findOne({programID: req.body.programID}, function (err, program) {
        if (err) throw err;
        if (program) return res.status(400).end("There is already program with programID: " + program.programID);
        else {
            Programs.collection.insertOne(req.body, (err)).then((data)=>{
                if(err) throw err;
                res.writeHead(200, {"Content-Type": "application/json"});
                res.status(201).end(JSON.stringify(data));
            })
        }
    })
};

module.exports.updateProgram = (req, res) =>{
    if (!req.params.id) return res.status(400).end("Invalid input");
    Programs.findOneAndUpdate({programID: req.params.id}, {$set: req.body}, {new: true}, (err, prog)=>{
        if (err) throw err;
        res.status(200).end('Program updated with programID: ' + prog.programID);
    })
};

module.exports.deleteProgram = function (req, res) {
    if (!req.body.programID) return res.status(400).end("Invalid input");
    Programs.findOneAndRemove({programID: req.params.id}, function (err, program) {
        if (err) throw err;
        res.status(200).end('Program deleted with programID: ' + program.programID);
    })
};


