'use strict'

var userController = require('../controller/user');
var authController = require('../controller/auth/authController');
var constants      = require('../../config/constants');
const variableDefined = constants[0].application;
const jwt = require("jsonwebtoken");
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

module.exports = function(app) {
//Check Express Middleware
// function isAuth(req, res, next){ 
//     var curSession  = req.session;
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     if(curSession.userRec ===  undefined ){
//         res.json({message: variableDefined.variables.logged_out, status:0});
//     return; // return undefined
//     }
//     return next();
// }
function isAuth(req, res, next) {
  // Gather the jwt access token from the request header
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ').pop();
  console.log(">>>header token: ", token);
  if (token == null) return res.sendStatus(401) // if there isn't any token
    //process.env.ACCESS_TOKEN_SECRET as string
  // jwt.verify(token, config.jwt_scret, (err: any, user: any) => {
  //   if (err) return res.sendStatus(403)
  //   req.user = user
  //   next() // pass the execution off to whatever request the client intended
  // })
}
//-------------------- AUTH Route ---------------------------------
app.route('/logout')
    .post(isAuth, userController.logout)
app.route('/login')
     .post(userController.validate('login'), userController.login)
//-------------------- AUTH Route ---------------------------------

//-------------------- USER SECTION REST ROUTE ---------------------------------

app.route('/user')
    .get(isAuth, userController.getList)
    .delete(isAuth, userController.delete)
    .post(userController.validate('create'), userController.create)  
app.put('/user', isAuth, userController.validate('update'),userController.update);  //PUT requires a callback, write differently

//-------------------- DO OTHER SECTION ---------------------------------


};