'use strict'

const express           = require("express");
const bodyParser        = require("body-parser");
const db                = require("./api/models");
var routes              = require('./api/routes/apiRoutes.js'); //importing route
const app               = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("app/public"));
routes(app,db); //register the route

app.listen(8080, () => console.log("App listening on port 8080!"));

//================================================================
//---------------------Migration Start----------------------------
//================================================================
//CREATE Tables automatically in database - from existing models
//Run Once on the server after UnComment and Comment
//const faker             = require("faker");
//const times             = require("lodash.times");
/*db.sequelize.sync().then(() => {
    //populate User table with dummy data if needed
    //   db.user.bulkCreate(
    //     times(10, () => ({
    //       firstName: faker.name.firstName(),
    //       lastName: faker.name.lastName()
    //     }))
    //   );    
});*/
//================================================================
//---------------------Migration End------------------------------
//Ref Link: https://sequelize.org/master/manual/migrations.html
//================================================================