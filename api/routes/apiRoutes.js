'use strict'

//const {check, validationResult} = require('express-validator/check');
//const passport = require('../../config/passport/passport');


module.exports = function(app, passport) {
var userController = require('../controller/user');
var authController = require('../controller/auth/authController');

//------ User Signup Process -------
//passport.authenticate('local-signup')
app.route('/login')
     .post(userController.validate('login'), userController.login)

app.route('/user', passport.authenticate('jwt', {session: false}))
    .get(userController.getList)
    .delete(userController.delete)
    .post(userController.validate('create'),userController.create)  
app.put('/user', userController.validate('update'),userController.update);

// Application Routes
// :: User Routes
//app.route('/user')
    //.get(userController(db).getList)
    /*.post(userController.create_a_User)
    .put(userController.update_a_User)
    .delete(userController.delete_a_User);
app.route('/user-by-email')
    .get(userController.getUserByEmail)
app.route('/user-by-id')
    .get(userController.getUserById)*/
};