'use strict'

const express           = require("express");
const bodyParser        = require("body-parser");
//const db                = require("./api/models");    //use if needed
var routes              = require('./api/routes/apiRoutes.js'); //importing route
//const expressValidator  = require('express-validator'); //use if needed
const session           = require('express-session');
const app               = express();
//const router            = express.Router(); //use if needed

//Application session
app.use(session({secret: 'scott-tiger'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("app/public"));  //use user upload section
routes(app);

app.listen(8085, () => {
    console.log("App listening on port 8085");
});
