'use strict'

//Get ORM object
var userController          = require('./user');
var theController           = require('./user');
var constants               = require('../../config/constants');
var theConstant             = require('../../config/constants');
//var bcrypt                  = require('bcrypt-nodejs');
var bcrypt                  = require('bcrypt');
var crypto                  = require('crypto'); 
const path                  = require('path');
const { body,validationResult,check } = require('express-validator');
const Sequelize             = require('sequelize'); 
const Op                    = Sequelize.Op;
const db                    = require('../models');
const theModel              = db.user; 
const theLoginModel         = db.applicationlogin; //Table namespace
const theContr              = userController;
const variableDefined       = constants[0].application;
const fs                    = require('fs');
var passCrypto              = require('../../config/passCrypto');
const bcrypt_SALT_ROUNDS    = 12;
//return 
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];

var saltPassword = '';
const jwt = require("jsonwebtoken");

console.log( " ::UserModel: ", theModel);
//return;

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {
  switch (method) {
    case 'create' : {
     return [ 
        body('first_name', variableDefined.variables.first_name_required).exists(),
        body('last_name', variableDefined.variables.last_name_required).exists(),
        //body('username', variableDefined.variables.username_required).exists(),
        body('email', variableDefined.variables.email_required).exists().isEmail(),
        body('mobile', variableDefined.variables.mobile_required)
         .exists()
         .isLength({ min: 10 })
         .withMessage(variableDefined.variables.mobile_strength)
         .isNumeric()
         .withMessage(variableDefined.variables.mobile_strength_step2),
        //  body('password')  
        //     .exists().withMessage(variableDefined.variables.password_required)
        //     .isLength({ min: 5, max:15 }).withMessage(variableDefined.variables.password_strength_step1)
        //     .matches(/^((?=.*\d)(?=.*[A-Z])(?=.*\W).{5,15})$/).withMessage(variableDefined.variables.password_strength_step2),
       ]   
    }
    case 'login' : {
      return [ 
         body('login_name', variableDefined.variables.login_name_required).exists(),
         body('password', variableDefined.variables.password_required).exists(),
        ]   
     }
    case 'update' : {
      return [ 
         body('first_name', variableDefined.variables.first_name_required).exists(),
         body('last_name', variableDefined.variables.last_name_required).exists(),
         //body('username', variableDefined.variables.username_required).exists(),
         body('email', variableDefined.variables.email_required).exists().isEmail(),
         body('mobile', variableDefined.variables.mobile_required)
         .exists()
         .isLength({ min: 10 })
         .withMessage(variableDefined.variables.mobile_strength)
         .isNumeric()
         .withMessage(variableDefined.variables.mobile_strength_step2),
        //  body('password')  
        //     .exists().withMessage(variableDefined.variables.password_required)
        //     .isLength({ min: 5, max:15 }).withMessage(variableDefined.variables.password_strength_step1)
        //     .matches(/^((?=.*\d)(?=.*[A-Z])(?=.*\W).{5,15})$/).withMessage(variableDefined.variables.password_strength_step2),
         
        ]   
     }
  }
}

exports.apiValidation   = function(req,resp){
  //console.log("Enter...bod: ", req.body);
  const errors          = validationResult(req);
  var validationErr     = [];
  var validationErrMesg = [];

  //console.log("@Valid Errorrs: ", errors);
  errors.array().forEach(error => {
      //console.log("#>>> ", error, " :: ", error.param);
      let found = validationErr.filter(errItem => error.param === errItem.param);
      if (!found.length) {
        validationErr.push(error);
      }       
  });
  if(validationErr.length){
    validationErr.forEach(rec => {
       validationErrMesg.push({field: rec.param, message: rec.msg});
    })
    resp.status(422).json({ errors: validationErrMesg, status:0 });
    return true;
  }
  return false;
}
//-----------------------------------------------------------------------
//-----------------API Required Field Validation ------------------------
//-----------------------******** END ********** ------------------------
//-----------------------------------------------------------------------
exports.hashPassword  = function(password){

  // Creating a unique salt for a particular user 
  saltPassword = crypto.randomBytes(16).toString('hex');  
  // Hashing user's salt and password with 1000 iterations, 
  //64 length and sha512 digest 
  let hashPassword = crypto.pbkdf2Sync(password, saltPassword,  
  1000, 64, `sha512`).toString(`hex`);
  console.log('Passw: ', hashPassword);
  return hashPassword;
}
//API Guard
/****************
 * () => APIGuard
 * require Token from headers
 */
 exports.authRequired = (req, res, next) => {
   //console.log("@Request Header: ", req.user);
  if (req.user) {
    next();
  } else {  
    return res.status(401).json({ status: 0, message: 'Valid Token Required!' });
  }
};

exports.checkHash = (userPassword, dbPassword) =>{
  return bcrypt.compare(userPassword, dbPassword);
}
/*-----------------------------------
/-------------LOGOUT USER------------
/---@body: NULL
/------------------------------------
------------------------------------*/
exports.logout   = function(req, res){
  req.session.destroy((err) => {
    if(err) {
      return console.log({message: variableDefined.variables.logout_unSuccess, status:0, error:err});
    }
    res.json({message: variableDefined.variables.logout_success, status:0});    
  });
}

/*-----------------------------------
/-------------LOGIN USER-------------
/---@body: [email, password] --------
/------------------------------------
------------------------------------*/
exports.login  = async (req, resp, next) => {
    var postBody  = req.body || null;
    theContr.apiValidation(req, resp);
    if(postBody.login_name != undefined && postBody.password != undefined){
      if(postBody.login_name){
        theLoginModel.findOne({
          where: {
            login_name: postBody.login_name
         }
        }).then(async (result) => { 
            if(result === null){
            resp.status(200).json({ message: 'Login Name Not Exists!',status : 0});
            return;
            }
            if(result.dataValues.id > 0){
               var getRecord  = result;
               var dbPassword = getRecord.login_password;  

              //Check sample password creation..........
              //  const salt = await bcrypt.genSalt(10);
              //  let passwd = await bcrypt.hash('123456', salt);
              //  console.log("@Password Created: ", passwd);
              //  return;

              bcrypt.compare(postBody.password, dbPassword, function (err, result) {
                  if(!result){
                    resp.status(200).json({ message: 'Password Not Valid, Please check',status : 0 });
                    return;
                  }
                  let payload = {};
                  let userRec = getRecord;
                  payload['id'] = userRec.id;
                  payload['login_name'] = userRec.login_name;
                  console.log("payload: ", payload);
                  let authToken = jwt.sign(payload, config.jwt_secret);
                  console.log("JWT: ", authToken);
                  resp.status(200).json({ message: 'Login success', authToken: authToken, status : 1});
              });              
           }
        });
      }      
    }
}

exports.createUser  = function(req, resp){
  var getData  = req.body || null;
  //Add required validation
  theContr.apiValidation(req, resp);
  if(typeof getData === 'object'){
    var getEmail        = getData.email || '';
    if(getData.email){
      theModel.findOne({           
        where: {
          [Op.or]: [{email: getEmail}, {mobile: getData.mobile}]
       }
      }).then(result => { 
       // console.log("@Get user: ", result);
          if(result != null){
            resp.json({ message: '@@@Duplicate User, Email/Mobile Exists!',status : 0 });
            return;
          }
          if(result === null){
            console.log("@Creating User....3", getData);
            theModel.create(getData).then(insertRecord => {
              let getRecord = insertRecord.dataValues;
              insertRecord = getRecord;
                if(insertRecord.id != undefined && insertRecord.id != ''){
                    let userId = insertRecord.id;
                    let updateData = {};
                    resp.status(200).json({ message: 'User Created Successfully', status:1, record: insertRecord });
                    return;
                    //Uploading file
                    // if(userAvatarFile != ''){
                    //     uploadDir = path.join('public/upload/user-avatar/', baseName + '_' + userId + extName);
                    //     updateData['user_avatar'] = baseName + '_' + userId + extName;
                    //     userAvatarFile.mv(uploadDir, (err) => {
                    //         if (err){                                            
                    //             resp.status(400).json({ message: "File Upload Error!", status : 0, error: err });
                    //         }
                    //     }); 
                    //     theModel.update(updateData, {where:{id:userId}}                                      
                    //       ).then((result)=>{
                    //         //resp.status(200).json({ message: '#Record Inserted!',status : 1, record: result });
                    //         return;
                    //       })
                    //       .catch((err)=>{
                    //         resp.status(400).json({ message: "Avatar Update Error!", status : 0, error: err });
                    //       })                              
                    // }                                  
                }
            })
            // .then((result)=>{
            //   console.log("Inserted: ", result, " :: ",  {message: 'User Created.. Successfully', data: result });
            //   resp.status(200).json({ message: 'User Created.. Successfully', data: result });
            //   return;
            // })
            .catch(function(err){
                resp.status(400).json({ message: "DB Insert Error!", status : 0, error: err });
                return;
            });
                        
         }
      });
    }      
  }
}

//Add List with pagination limit
/*-----------------------------------
/-------------LIST USER--------------
/---@body: NULL ---------------------
/------------------------------------
------------------------------------*/
 exports.getUserList  =  (req, resp) =>{
    let pg_limit     = 1; 
    let offset       = 0;
    if(req.query.op !== undefined && req.query.op == 'one'){                        
        theModel.findAndCountAll(
          {
            limit: limit,
            order: [['id', 'DESC']]
          }
        ).then(userRecord => {
          resp.status(200).json({ message: 'User Lists',status : 1, data: userRecord.rows[0], totalCount: userRecord.count });
          return;
        }).catch(function (error) {
          resp.status(400).send('List Error: ', error);
          return;
        });
    }else if(req.query.op !== undefined && req.query.op == 'all'){
          pg_limit = req.query.limit;
          offset = 0 + (req.query.page - 1) * pg_limit;
          theModel.findAndCountAll(
            {
              offset: offset,
              limit: parseInt(pg_limit),
              order: [['id', 'DESC']]
            }
          ).then(userRecord => {
            resp.status(200).json({ message: 'User Lists',status : 1, data: userRecord.rows, totalCount: userRecord.count });
            return;
          }).catch(function (error) {
            resp.status(400).send('List Error: ', error);
            return;
          });
    }else{
        resp.status(200).json({ message: 'Please check [op] parameter to be valid entry',status : 0 });
        return;
    }
}

//Get User By Mobile
exports.getUserByMob  =  (req, resp)  =>{
  if(req.query.mob == undefined || req.query.mob == null){
      resp.status(400).json({ message: 'Parameter id Not found.',status : 0 });
      return;
  }  
  let getMobile =  req.query.mob || null;
  theModel.findAll({
    where: {
      mobile: {
        [Op.like]: '%'+getMobile+'%'
      }
    }
  }).then(userRecord => {
    console.log("@User Data: ", userRecord);
    resp.status(200).json({ message: 'User By Record',status : 1, data: userRecord });
    return;
  }).catch(function (error) {
    resp.status(400).send('List Error: ', error);
  });
}

//Get User By ID
exports.getUserByID  =  (req, resp)  =>{
  if(req.query.id == undefined || req.query.id == null){
      resp.status(400).json({ message: 'Parameter id Not found.',status : 0 });
      return;
  }  
  let getID =  req.query.id || null;
  theModel.findOne({
    where: {
      id: getID
    }
  }).then(userRecord => {
    console.log("@User Data: ", userRecord);
    resp.status(200).json({ message: 'User By Record',status : 1, data: userRecord });
    return;
  }).catch(function (error) {
    resp.status(400).send('List Error: ', error);
  });
}

/*-----------------------------------
/-------------CREATE USER -----------
/---@body: [id, email,username]------
/------------------------------------
------------------------------------*/

exports.create  = (req, resp, next) => {   

  //Add required validation
  var validReturn   = theController.apiValidation(req, resp);
  //if(validReturn) return;
  
  var getData         = req.body || null;
  let getFiles        =   req.files || null;    
  let userAvatarFile  = '';
  let extName         = '';
  let baseName        = '';
  let uploadDir       = '';

  console.log("@Get body: ",getData, " :: ", getData.first_name,  " : ", );

  ///Uploading files configuration
  if(getFiles != null && typeof getFiles == 'object'){
      userAvatarFile  = req.files.file;
      extName         = path.extname(userAvatarFile.name.toString());
      baseName        = path.basename(userAvatarFile.name, extName);
      uploadDir       = path.join('public/upload/user-avatar/', userAvatarFile.name);

      let imgList = ['.png','.jpg','.jpeg','.gif'];
      // Checking the file type
      if(!imgList.includes(extName)){
          //fs.unlinkSync(userAvatarFile.tempFilePath);
         resp.status(422).json({ message: "File name should be [png|jpes|jpg|gif]", status : 0});
         return;
      }
      //Max upload size 1MB = 
      if(userAvatarFile.size > 1048576){
          //fs.unlinkSync(userAvatarFile.tempFilePath);
          resp.status(413).json({ message: "File size is larger, Maximum 1MB allowed", status : 0});
          return;
      }
  }
  if(typeof getData === 'object'){
      var getEmail   = getData.email || '';
      var getUserName    = getData.username;
      if(getEmail){
         theModel.findOne({           
          where: {
           [Op.or]: [{email: getEmail}, {username: getUserName}]
         }
        }).then(user =>
          {
            console.log("@@@Find User: ", user);            
              if(user != null && typeof user === 'object'){
                  resp.status(400).json({ message: "User Already Exists.", record : user });
                  return;
              }
              if(user == null){                    
                  //Create HASH Password
                  //bcrypt.hash(req.body.passwordsignup, saltRounds, function (err,   hash) {
                  bcrypt.hash(getData.password, bcrypt_SALT_ROUNDS)
                      .then(function(hashedPassword) {
                          getData.password = hashedPassword;                            
                          theModel.create(getData).then(insertRecord => {
                            let getRecord = insertRecord.dataValues;
                            insertRecord = getRecord;
                              console.log("@@@@inserted: ", insertRecord);
                              if(insertRecord.id != undefined && insertRecord.id != ''){
                                  let userId = insertRecord.id;
                                  let updateData = {};
                                  //Uploading file
                                  if(userAvatarFile != ''){
                                      uploadDir = path.join('public/upload/user-avatar/', baseName + '_' + userId + extName);
                                      updateData['user_avatar'] = baseName + '_' + userId + extName;
                                      userAvatarFile.mv(uploadDir, (err) => {
                                          if (err){                                            
                                              resp.status(400).json({ message: "File Upload Error!", status : 0, error: err });
                                          }
                                      }); 
                                      theModel.update(updateData, {where:{id:userId}}                                      
                                        ).then((result)=>{
                                          //resp.status(200).json({ message: '#Record Inserted!',status : 1, record: result });
                                          return;
                                        })
                                        .catch((err)=>{
                                          resp.status(400).json({ message: "Avatar Update Error!", status : 0, error: err });
                                        })                              
                                  }                                  
                              }
                          })
                      })
                  .then((result)=>{
                    console.log("Inserted: ", result);
                    resp.status(200).json({ message: '@Record Inserted!',status : 1, record: result });
                    return;
                  })
                  .catch(function(err){
                      resp.status(400).json({ message: "DB Insert Error!", status : 0, error: err });
                      next();
                  });
              }
          }).catch((err) => {
            console.log(err);
            resp.status(400).json({ message: "Something went wrong Please check later" });
           })
      }
   return;
   }
}

exports.isEmptyObject = (object) => {
for(let key in object){
    if(object.hasOwnProperty(key)){
        return false;
    }
}
return true;
}

/*-----------------------------------
/-------------UPDATE USER -----------
/---@body: [id, email,username]------
/------------------------------------
------------------------------------*/
//Update User
/**************** 
 * () => userUpdate
 * @body     -   POST Body Data
 * Query Params /?id
 * All model field data
 * @firstName   -   required   
 * @lastName    -   required
 * @email       -   required   
 * @userName    -   required
 * 
 */
 exports.update  = (req, resp, next) => {    

  console.log(">>GET POST: ",  " == ", req.method, " ::: ", req.files, " :: ", req.body );
  var validReturn   = theController.apiValidation(req, resp);
  if(validReturn) return;


  let getData     =   req.body || null;
  let getParams   =   req.query || null;
  let getFiles    =   req.files || null;    
  let userId          = '';
  let userAvatarFile  = '';
  let extName = '';
  let baseName = '';
  let uploadDir = '';
  console.log("@updating User....1 : ",getData, " :: ", getParams);
  //return;
  ///Uploading files configuration
  if(getFiles != null && typeof getFiles == 'object'){
      userAvatarFile = req.files.file;
      console.log("Uploading file: ", userAvatarFile, " -- ", userAvatarFile.name);
      extName = path.extname(userAvatarFile.name.toString());
      baseName = path.basename(userAvatarFile.name, extName);
      uploadDir = path.join('public/upload/user-avatar/', userAvatarFile.name);

      let imgList = ['.png','.jpg','.jpeg','.gif'];
      // Checking the file type
      if(!imgList.includes(extName)){
          //fs.unlinkSync(userAvatarFile.tempFilePath);
         resp.status(422).json({ message: "File name should be [png|jpes|jpg|gif]", status : 0});
         return;
      }
      //Max upload size 1MB
      if(userAvatarFile.size > 1048576){
          //fs.unlinkSync(userAvatarFile.tempFilePath);
          resp.status(413).json({ message: "File size is larger, Maximum 1MB allowed", status : 0});
          return;
      }
  }

  if(getParams != undefined && typeof getParams === 'object'){
      if(getParams.id === undefined){
          resp.status(400).json({ message: "Update: id params required", status : 0});
          return;
      }
      if(getParams.id !== undefined && getParams.id == ''){
          resp.status(400).json({ message: "Update: id params should be a Valid ID value", status : 0});
          return;
      }
      userId = getParams.id;
  }
  console.log(">>>> params: ", getParams, " :: ", userId);
 //[Op.or]: [{email: getEmail}, {username: getUserName}, {mobile: getData.mobile}]
  if(typeof getData === 'object'){
      var getEmail       = getData.email || '';
      if(getEmail){
        theModel.findOne({           
          where: {
            [Op.or]: [{email: getEmail}, {mobile: getData.mobile}],
            id: {
              [Op.ne]: userId
            }
         }
        }).then(user =>
          {
            console.log(">>> found: ", user);
              if(user != null && typeof user === 'object' && typeof user.dataValues === 'object'){
                resp.json({ message: "User Already Exists.", record : user });
                return;
              }               
              if(user === null){

                console.log("@@@@@@@@Need to update....");
                if(userAvatarFile != ''){
                  //Uploading file
                  uploadDir = path.join('public/upload/user-avatar/', baseName + '_' + userId + extName);
                  getData['user_avatar'] = baseName + '_' + userId + extName;
                  console.log(">>>File: ", getData);
                  userAvatarFile.mv(uploadDir, (err) => {
                      if (err){                                            
                          resp.status(400).json({ message: "File Upload Error!", status : 0, error: err });
                      }
                  });
                }
                let updateData = getData;
                // if(getData.password != undefined && getData.password != ''){
                //   bcrypt.hash(getData.password, bcrypt_SALT_ROUNDS)
                //       .then(function(hashedPassword) {
                //         updateData.password = hashedPassword;
                //         theModel.update(updateData, {where:{id:userId}}
                //           ).then((result)=>{
                //             resp.status(200).json({ message: '#Record Updated!',status : 1, record: result });
                //             return;
                //           })
                //           .catch((err)=>{
                //             resp.status(400).json({ message: "Avatar Update Error!", status : 0, error: err });
                //           })   
                //       });
                // }
                theModel.update(updateData, {where:{id:userId}}                                      
                  ).then((result)=>{
                    console.log("@@@@ Record Updated....");
                    resp.status(200).json({ message: 'Record Updated!',status : 1, record: result });
                    //return;
                  })
                  .catch((err)=>{
                    console.log("@@@@ Record Updated Error....");
                    resp.status(400).json({ message: " Update Error!", status : 0, error: err });
                  })   
                    
            }
        });
      }
   return;
   }    
}

/*-----------------------------------
/------------- DELETE USER ----------
/---@param: id [i.e. /user?id=]------ 
/------------------------------------
------------------------------------*/
exports.delete = function(req, resp) {
  theModel.destroy({
    where: {
      id: req.query.id
    }
  }).then((result) => {
      if(result)
        resp.json({ message: variableDefined.variables.record_deleted,'status' : result });
      else
        resp.json({ message: variableDefined.variables.record_deleted_error,'status' : result });
  })
};
