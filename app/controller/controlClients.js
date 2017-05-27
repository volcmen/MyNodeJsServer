const Client = require('../models/client'),
    clientPass = Client();
const passport = require('../config/passport');



module.exports = {};


module.exports.l0g1nCl13nt = function (req, res, next) {
    if (!req.body.password) return res.status(404).end("Invalid input");

    Client.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
        if (err) throw err;
        if (!user) return res.status(404).end("Invalid client");
        const pass = user.password,
            enteredPass = clientPass.encryptPassword(req.body.password);
        if (pass !== enteredPass) return res.status(401).end("Wrong pass");
        else {
            user = user.toObject();
            res.json(user);
        }
    })
};


module.exports.cr34t3Cl13nt = function (req, res) {
    if(!req.body.email || !req.body.password) return res.status(400).end("Invalid input");

    Client.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
        if (err) throw(err);
        if (user) return res.status(400).end("Client already exists");
        let newBody = req.body;
        newBody.password = clientPass.encryptPassword(req.body.password);
        newBody.token = clientPass.generateJwt();
        Client.collection.insertOne(newBody, (err)).then((data)=>{
            if(err) throw err;
            res.status(201).json(data);
        });
    })
};


module.exports.sh0wCl13nt2 = function (req, res) {
    Client.find({}, function (err, users) {
        if (err) throw err;
        else {
            res.json(users);
        }
    })
};

module.exports.f1ndBy1D = function (req, res) {
    Client.findById(req.params.id, function (err, client) {
        if (client) {
            client = client.toObject();
            res.json(client);
        } else return res.status(400).end("Client not found or wrong ID");
    })
};

module.exports.f1ndBy3m41l = function (req, res) {
    Client.findOne({email : req.params.email.toLowerCase()}, function (err, client) {
        if (client) {
            client = client.toObject();
            res.json(client);
        } else return res.status(400).end("Client not found");
    })
};



module.exports.upd4t3Cl13nt = function (req, res) {
    if (!req.params.email) return res.status(400).end("Invalid input");
    Client.findOneAndUpdate({email: req.params.email.toLowerCase()}, {$set: req.body}, {new: true}, (err, client)=>{
        if (err) throw err;
        if (!client) return res.status(409).send('No such client with email: ' + req.params.email.toLowerCase());
        res.status(201).end('Client updated with email: ' + client.email.toLowerCase());
    })
};

module.exports.d3l3t3 = function (req, res) {
    Client.findOneAndRemove({email : req.params.email.toLowerCase()}, function (err, client){
        if (err) throw err;
        if (!client) return res.status(409).send('No such client with email: ' + req.params.email.toLowerCase());
        res.status(200).end('Client deleted with email: ' + client.email);
    })
};





// module.exports.m3 = function (req, res) {
//     Client.findOne({email: req.params.email}, function (err, user) {
//         if (user){
//             user = user.toObject();
//             res.end(JSON.stringify(user));
//         } else return res.status(400).end("User Not Found");
//     })
// };
