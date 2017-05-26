const Gym = require('../models/gym'),
    gymfuncts = Gym();

module.exports = {};


module.exports.getAllGyms = function (req, res) {
    Gym.find({}, function (err, gyms) {
        if (err) throw err;
        else {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(gyms));
        }
    })
};


module.exports.createGym = function (req, res) {
    if (!req.body.id) return res.status(400).end("Invalid input");
    Gym.findOne({id: req.body.id}, function (err, gyms) {
        if (err) throw err;
        if (gyms) return res.status(400).end("There is already gym with id: " + gyms.id);
        else {
            let newGym = new Gym();
            newGym.id = req.body.id;
            newGym.address = req.body.address ? req.body.address : newGym.address;
            if (req.file) newGym.photo = req.file.filename ? req.file.filename : newGym.photo;
            newGym.users = req.body.users ? req.body.users : newGym.users;
            newGym.gymsDiscription = req.body.gymsDiscription ? req.body.gymsDiscription : newGym.gymsDiscription;
            newGym.workingTime = req.body.workingTime ? req.body.workingTime : newGym.workingTime;
            newGym.ourHistory = req.body.ourHistory ? req.body.ourHistory : newGym.ourHistory;
            newGym.clients = req.body.clients ? req.body.clients : newGym.clients;

            newGym.save();

            res.writeHead(200, {"Content-Type": "multipart/form-data"});
            newGym = newGym.toObject();
            res.end(JSON.stringify(newGym));
        }
    })
};

module.exports.updateGym = function (req, res) {
    Gym.findOne({id: req.params.id}, function (err, gym) {
        if (err) throw err;
        if (gym) {
            gym.id = req.body.id;
            gym.address = req.body.address ? req.body.address : gym.address;
            if (req.file) gym.photo = req.file.filename ? req.file.filename : gym.photo;
            gym.users = req.body.users ? gymfuncts.addUsers(req.body.users) : gym.users;
            gym.gymsDiscription = req.body.gymsDiscription ? req.body.gymsDiscription : gym.gymsDiscription;
            gym.workingTime = req.body.workingTime ? req.body.workingTime : gym.workingTime;
            gym.ourHistory = req.body.ourHistory ? req.body.ourHistory : gym.ourHistory;
            gym.clients = req.body.clients ? gymfuncts.addClients(req.body.clients) : gym.clients;

            gym.save();

            res.writeHead(200, {"Content-Type": "multipart/form-data"});
            gym = gym.toObject();
            res.end(JSON.stringify(gym));
        } else return res.status(400).end('Gym not found');
    })
};

module.exports.deleteGym = function (req, res) {
    Gym.findOneAndRemove({id : req.params.id}, function (err, gym){
        if (err) throw err;
        res.status(200).end('Gym deleted with id: ' + gym.id);
    })
};