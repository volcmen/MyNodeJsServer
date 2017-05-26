const mongoose = require('mongoose');
const express = require('express');
const MongoStore = require('connect-mongo')(express);

const sessionStore = new MongoStore({mongoose_connection: mongoose.connection});

module.exports = sessionStore;