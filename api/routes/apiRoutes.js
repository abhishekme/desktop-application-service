'use strict'

//Declare controlers
const userController = require("../controller/user");

module.exports = function(app) { 
  // Routes
  //Welcome Application route
  app.get("/", function(req, res) { 
    res.send("Hello Node \_/");
  });

    //REST API Routes
    app.route('/user')
      .get(userController.authRequired, userController.getUserList)
      .post(userController.validate('create'), userController.createUser)
      .put(userController.validate('update'), userController.update) 
      .delete(userController.delete)
    
    app.route('/userByMob')
      .get(userController.getUserByMob)

    app.route('/userById')
        .get(userController.getUserByID)
    
    app.route('/login')
      .post(userController.validate('login'), userController.login) 
};
