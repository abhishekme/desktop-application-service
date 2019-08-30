'use strict'

const express           = require("express");
const bodyParser        = require("body-parser");
var flash               = require('connect-flash');
var passport            = require('passport')
var session             = require('express-session')
const db                = require("./api/models");
var routes              = require('./api/routes/apiRoutes.js'); //importing route
const expressValidator  = require('express-validator');
const app               = express();

// For Passport
app.use(session({ secret: 'scott tiger',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(expressValidator());
app.use(express.static("app/public"));
routes(app,passport); //register the route
require('./config/passport/passport')(passport, db.user);








app.listen(8080, () => console.log("App listening on port 8080!"));
