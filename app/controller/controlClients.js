var Client = require('../models/client'),
    clientPass = Client();
var passport = require('../config/passport');



module.exports = {};


module.exports.l0g1nCl13nt = function (req, res, next) {
    if (!req.body.password) return res.status(404).end("Invalid input");

    Client.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
        if (err) throw err;
        if (!user) return res.status(404).end("Invalid client");
        var pass = user.password,
            enteredPass = clientPass.encryptPassword(req.body.password);
        if (pass !== enteredPass) return res.status(401).end("Wrong pass");
        else {
            res.writeHead(200, {"Content-Type": "application/json"});
            user = user.toObject();
            res.end(JSON.stringify(user));
        }
    })
};


module.exports.cr34t3Cl13nt = function (req, res) {
    if(!req.body.email || !req.body.password) return res.status(400).end("Invalid input");

    Client.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
        if (err) throw(err);
        if (user) return res.status(400).end("Client already exists");
        else {
            var newClient = new Client();
            newClient.email = req.body.email.toLowerCase();
            newClient.password = newClient.encryptPassword(req.body.password);
            newClient.token = newClient.generateJwt();

            newClient.login = req.body.login ? req.body.login : newClient.login;
            newClient.role = req.body.role ? req.body.role : newClient.role;
            newClient.profile.id = req.body.id ? req.body.id : newClient.profile.id;
            newClient.profile.name = req.body.name ? req.body.name : newClient.profile.name;
            newClient.profile.sureName = req.body.sureName ? req.body.sureName : newClient.profile.sureName;
            newClient.profile.segment = req.body.segment ? req.body.segment : newClient.profile.segment;
            newClient.profile.gender = req.body.gender ? req.body.gender : newClient.profile.gender;
            newClient.profile.birthDate = req.body.BDay ? req.body.BDay : newClient.profile.birthDate;
            newClient.profile.phoneNum = req.body.PNum ? req.body.PNum : newClient.profile.phoneNum;
            newClient.profile.coach = req.body.coach ? req.body.coach : newClient.profile.coach;
            newClient.profile.programs = req.body.programs ? req.body.programs : newClient.profile.programs;
            newClient.profile.abonnement.id = req.body.abnmtId ? req.body.abnmtId : newClient.profile.abonnement.id;
            newClient.profile.abonnement.status = req.body.abnmtStatus ? req.body.abnmtStatus : newClient.profile.abonnement.status;
            newClient.profile.abonnement.issueDate = req.body.abnmtIssueDate ? req.body.abnmtIssueDate : newClient.profile.abonnement.issueDate;
            newClient.profile.abonnement.expDate = req.body.abnmtExpDate ? req.body.abnmtExpDate : newClient.profile.abonnement.expDate;

            if (req.file) newClient.profile.photo = req.file.filename ? req.file.filename : newClient.profile.photo;


            newClient.save();

            res.writeHead(200, {"Content-Type": "multipart/form-data"});

            newClient = newClient.toObject();
            res.end(JSON.stringify(newClient));
        }
    })
};


module.exports.sh0wCl13nt2 = function (req, res) {
    Client.find({}, function (err, users) {
        if (err) throw err;
        else {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(users));
        }
    })
};

module.exports.f1ndBy1D = function (req, res) {
    Client.findById(req.params.id, function (err, client) {
        if (client) {
            res.writeHead(200, {"Content-Type": "application/json"});
            client = client.toObject();
            res.end(JSON.stringify(client));
        } else return res.status(400).end("Client not found or wrong ID");
    })
};

module.exports.f1ndBy3m41l = function (req, res) {
    Client.findOne({email : req.params.email.toLowerCase()}, function (err, client) {
        if (client) {
            res.writeHead(200, {"Content-Type": "application/json"});
            client = client.toObject();
            res.end(JSON.stringify(client));
        } else return res.status(400).end("Client not found");
    })
};



module.exports.upd4t3Cl13nt = function (req, res) {
    Client.findOne({email : req.params.email.toLowerCase()}, function (err, client) {
        if (err) throw err;
        if (client){
            client.login = req.body.changeLogin ? req.body.changeLogin : client.login;
            client.role = req.body.changeRole ? req.body.changeRole : client.role;
            client.profile.id = req.body.changeID ? req.body.changeID : client.profile.id;
            client.profile.name = req.body.changeName ? req.body.changeName : client.profile.name;
            client.profile.sureName = req.body.changeSureName ? req.body.changeSureName : client.profile.sureName;
            client.profile.segment = req.body.changeSegment ? req.body.changeSegment : client.profile.segment;
            client.profile.gender = req.body.changeGender ? req.body.changeGender : client.profile.gender;
            client.profile.birthDate = req.body.changeBDay ? req.body.changeBDay : client.profile.birthDate;
            client.profile.phoneNum = req.body.changePNum ? req.body.changePNum : client.profile.phoneNum;
            client.profile.coach = req.body.changeCoach ? req.body.changeCoach : client.profile.coach;
            client.profile.programs = req.body.changePrograms ? req.body.changePrograms : client.profile.programs;
            client.profile.abonnement.id = req.body.changeAbnmtId ? req.body.changeAbnmtId : client.profile.abonnement.id;
            client.profile.abonnement.status = req.body.changeAbnmtStatus ? req.body.changeAbnmtStatus : client.profile.abonnement.status;
            client.profile.abonnement.issueDate = req.body.changeAbnmtIssueDate ? req.body.changeAbnmtIssueDate : client.profile.abonnement.issueDate;
            client.profile.abonnement.expDate = req.body.changeAbnmtExpDate ? req.body.changeAbnmtExpDate : client.profile.abonnement.expDate;

            if (req.file) client.profile.photo = req.file.filename ? req.file.filename : client.profile.photo;


            client.save();

            res.writeHead(200, {"Content-Type": "multipart/form-data"});
            client = client.toObject();
            res.end(JSON.stringify(client));
        } else return res.status(400).end('Client not found with email ' + client.email)
    })
};

module.exports.d3l3t3 = function (req, res) {
    Client.findOneAndRemove({email : req.params.email.toLowerCase()}, function (err, client){
        if (err) throw err;
        res.status(200).end('Client deleted with email: ' + client.email);
    })
};





// module.exports.m3 = function (req, res) {
//     Client.findOne({email: req.params.email}, function (err, user) {
//         if (user){
//             res.writeHead(200, {"Content-Type": "application/json"});
//             user = user.toObject();
//             res.end(JSON.stringify(user));
//         } else return res.status(400).end("User Not Found");
//     })
// };
