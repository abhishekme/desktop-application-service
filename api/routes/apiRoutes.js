'use strict'

var userController = require('../controller/user');
var authController = require('../controller/auth/authController');

module.exports = function(app) {
//Check Express Middleware
function isAuth(req, res, next){
    var curSession  = req.session;
    if(curSession.userRec !=  undefined && curSession.userRec.id > 0){
        res.json({message:"You are not logged in, please log in", status:0});
    }
    res.json({message:"You are not logged in, please log in", status:0});
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
    .post(userController.validate('create'),userController.create)  
app.put('/user', isAuth, userController.validate('update'),userController.update);

//-------------------- DO OTHER SECTION ---------------------------------


};