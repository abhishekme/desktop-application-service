'use strict'

const express           = require("express");
const bodyParser        = require("body-parser");
const db                = require("./api/models");
var routes              = require('./api/routes/apiRoutes.js'); //importing route
const expressValidator  = require('express-validator');
const app               = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(expressValidator());
app.use(express.static("app/public"));
routes(app,db); //register the route

app.listen(8080, () => console.log("App listening on port 8080!"));
