'use strict'

module.exports = function(app,db) {
    
var userController = require('../controller/user');
app.route('/user')
    .get(userController.getList)
    .delete(userController.delete)
    .put(userController.update)
    .post(userController.create)  

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