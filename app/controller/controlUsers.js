var UserModel = require('../models/user'),
    userPass = UserModel();

module.exports = {};



module.exports.cr34t3Us3r = function (req, res) {
    if(!req.body.email || !req.body.password) return res.status(400).end("Invalid input");

    UserModel.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
        if (err) throw(err);
        if (user) return res.status(400).end("Employee already exists");
        else {
            var newUser = new UserModel();
            newUser.email = req.body.email.toLowerCase();
            newUser.password = newUser.encryptPassword(req.body.password);
            newUser.token = newUser.generateJwt();
            newUser.login = req.body.login ? req.body.login : newUser.login;

            newUser.role = req.body.role ? req.body.role : newUser.role;
            newUser.profile.id = req.body.id ? req.body.id : newUser.profile.id;
            newUser.profile.name = req.body.name ? req.body.name : newUser.profile.name;
            newUser.profile.sureName = req.body.sureName ? req.body.sureName : newUser.profile.sureName;
            newUser.profile.segment = req.body.segment ? req.body.segment : newUser.profile.segment;
            newUser.profile.gender = req.body.gender ? req.body.gender : newUser.profile.gender;
            newUser.profile.birthDate = req.body.BDay ? req.body.BDay : newUser.profile.birthDate;
            newUser.profile.phoneNum = req.body.PNum ? req.body.PNum : newUser.profile.phoneNum;
            newUser.profile.personalInfo = req.body.PInfo ? req.body.PInfo : newUser.profile.personalInfo;
            newUser.profile.gym = req.body.gym ? req.body.gym : newUser.profile.gym;

            if (req.file) newUser.profile.photo = req.file.filename ? req.file.filename : newUser.profile.photo;


            newUser.save();

            res.writeHead(200, {"Content-Type": "multipart/form-data"});

            newUser = newUser.toObject();
            res.end(JSON.stringify(newUser));
        }
    })
};


module.exports.l0g1nUs3r = function (req, res, next) {
    if (!req.body.password) return res.status(404).end("Invalid input");

    UserModel.findOne({email: req.body.email.toLowerCase()}, function (err, user) {
        if (err) throw err;
        if (!user) return res.status(404).end("Invalid employee");
        var pass = user.password,
            enteredPass = userPass.encryptPassword(req.body.password);
        if (pass !== enteredPass) return res.status(401).end("Wrong pass");
        else {
            res.writeHead(200, {"Content-Type": "application/json"});
            user = user.toObject();
            res.end(JSON.stringify(user));
        }
    })
};

module.exports.sh0wUs3rs = function (req, res) {
    UserModel.find({}, function (err, users) {
        if (err) throw err;
        else {
            res.writeHead(200, {"Content-Type": "application/json"});
            // users = users.toObject();
            res.end(JSON.stringify(users));
        }
    })
};

module.exports.f1ndBy1D = function (req, res) {
    UserModel.findById(req.params.id, function (err, user) {
        if (user) {
            res.writeHead(200, {"Content-Type": "application/json"});
            user = user.toObject();
            res.end(JSON.stringify(user));
        } else return res.status(400).end("Employee not found or wrong ID");
    })
};

module.exports.f1ndBy3m41l = function (req, res) {
    UserModel.findOne({email : req.params.email.toLowerCase()}, function (err, user) {
        if (user) {
            res.writeHead(200, {"Content-Type": "application/json"});
            user = user.toObject();
            res.end(JSON.stringify(user));
        } else return res.status(400).end("Employee not found");
    })
};


module.exports.upd4t3us3r = function (req, res) {
    UserModel.findOne({email : req.params.email.toLowerCase()}, function (err, user) {
        if (err) throw err;
        if (user){
            user.login = req.body.changeLogin ? req.body.changeLogin : user.login;
            user.role = req.body.changeRole ? req.body.changeRole : user.role;
            user.profile.id = req.body.changeID ? req.body.changeID : user.profile.id;
            user.profile.name = req.body.changeName ? req.body.changeName : user.profile.name;
            user.profile.sureName = req.body.changeSureName ? req.body.changeSureName : user.profile.sureName;
            user.profile.segment = req.body.changeSegment ? req.body.changeSegment : user.profile.segment;
            user.profile.gender = req.body.changeGender ? req.body.changeGender : user.profile.gender;
            user.profile.birthDate = req.body.changeBDay ? req.body.changeBDay : user.profile.birthDate;
            user.profile.phoneNum = req.body.changePNum ? req.body.changePNum : user.profile.phoneNum;
            user.profile.personalInfo = req.body.changePInfo ? req.body.changePInfo : user.profile.personalInfo;
            user.profile.gym = req.body.changeGym ? req.body.changeGym : user.profile.gym;

            if (req.file) user.profile.photo = req.file.filename ? req.file.filename : user.profile.photo;

            user.save();

            res.writeHead(200, {"Content-Type": "multipart/form-data"});
            user = user.toObject();
            res.end(JSON.stringify(user));
        } else return res.status(400).end('Employee not found')
    })
};

module.exports.d3l3t3 = function (req, res) {
    UserModel.findOneAndRemove({email : req.params.email.toLowerCase()}, function (err, user){
        if (err) throw err;
        res.status(200).end('Employee deleted with email: ' + user.email);
    })
};