const Gym = require('../models/gym');

module.exports = {};


module.exports.getAllGyms = function (req, res) {
    Gym.find({}, function (err, gyms) {
        if (err) throw err;
        else {
            res.json(gyms);
        }
    })
};


module.exports.createGym = function (req, res) {
    if (!req.body.id) return res.status(400).end("Invalid input");
    Gym.findOne({id: req.body.id}, function (err, gyms) {
        if (err) throw err;
        if (gyms) return res.status(400).end("There is already gym with id: " + gyms.id);
        else {
            Gym.collection.insertOne(req.body, (err)).then((data) => {
                if (err) throw err;
                res.status(201).end(JSON.stringify(data));
            })
        }
    })
};

module.exports.updateGym = function (req, res) {
    Gym.findOneAndUpdate({id: req.params.id}, {$set: req.body}, {new: true}, (err, gym)=>{
        if (err) throw err;
        if (!gym) return res.status(409).send('No such gym with id: ' + req.params.id);
        res.status(200).end('Gym updated with id: ' + gym.id);
    })
};

module.exports.deleteGym = function (req, res) {
    Gym.findOneAndRemove({id : req.params.id}, function (err, gym){
        if (err) throw err;
        if (!gym) return res.status(409).send('No such gym with id: ' + req.params.id);
        res.status(200).end('Gym deleted with id: ' + gym.id);
    })
};