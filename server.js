'use strict'

const express           = require("express");
const bodyParser        = require("body-parser");
const db                = require("./api/models");
var routes              = require('./api/routes/apiRoutes.js'); //importing route
const expressValidator  = require('express-validator');

const session           = require('express-session');
const app               = express();
const router            = express.Router();

//Application session
app.use(session({secret: 'scott-tiger'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("app/public"));
routes(app);
// router.get("/user/:id",(req,res,next)=>{
//     console.log('Request URL:', req.originalUrl)
//     next()
// },(req,res,next)=>{
//     console.log('Request Type:', req.method)
//     next()
// },(req,res)=>{
//     res.json({
//         status:true,
//         id:req.params.id
//     })
// })


app.listen(8085, () => {
    console.log("App listening on port 8085");
});
