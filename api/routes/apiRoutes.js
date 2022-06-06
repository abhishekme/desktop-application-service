'use strict'

//Declare controlers
const userController          = require("../controller/user");
const patientController       = require("../controller/patient");
const testCategoryController  = require("../controller/testCategory");
const testMasterController  = require("../controller/testMaster");

module.exports = function(app) {
  //Routes
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

    //Patient Route
    app.route('/patient')
      .get(patientController.authRequired, patientController.getList)
      .post(patientController.validate('create'), patientController.create)
      .put(patientController.validate('update'), patientController.update)
      .delete(patientController.delete)
    app.route('/searchByMob')
      .get(patientController.searchByMob)
    app.route('/searchByCaseID')
      .get(patientController.searchByCaseID)
        
    //Test Route
    app.route('/testMaster')
      .get(testMasterController.authRequired, testMasterController.getList)
      .post(testMasterController.validate('create'), testMasterController.create)
      .put(testMasterController.validate('update'),  testMasterController.update)
      .delete(testMasterController.delete)
    app.route('/searchByTestName')
      .get(testMasterController.searchByTestName)
    app.route('/searchByTestCategory')
      .get(testMasterController.searchByTestCategory)
      

    //Test Category Route
    app.route('/testCategory')
      .get(testCategoryController.authRequired, testCategoryController.getList)
      .post(testCategoryController.validate('create'), testCategoryController.create)
      .put(testCategoryController.validate('update'),  testCategoryController.update)
      .delete(testCategoryController.delete)
    app.route('/searchByTestName')
      .get(testCategoryController.searchByTestName)
    app.route('/searchByShortName')
      .get(testCategoryController.searchByShortName)    
    
    //Login Route
    app.route('/login')
      .post(userController.validate('login'), userController.login) 
};
