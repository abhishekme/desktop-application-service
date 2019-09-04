'use strict'

//Get ORM object
var userController          = require('./user');
var bCrypt                  = require('bcrypt-nodejs');
const { body }              = require('express-validator');
const { validationResult }  = require('express-validator');
const Sequelize             = require('sequelize');
const Op                    = Sequelize.Op;
const db                    = require("../models");
const theModel              = db.user; 
const theContr              = userController;

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {
  switch (method) {
    case 'create' : {
     return [ 
        body('first_name', 'First name is required').exists(),
        body('username', 'UserName is required').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('password', 'Password is required').exists(),
       ]   
    }
    case 'login' : {
      return [ 
         body('email', 'Invalid email').exists().isEmail(),
         body('password', 'Password is required').exists(),
        ]   
     }
    case 'update' : {
      return [ 
         body('first_name', 'First name is required').exists(),
         body('last_name', 'Last name is required').exists(),
         body('username', 'UserName is required').exists(),
         body('password', 'Password is required')
            .isLength({min: 8, max:15})
            .withMessage('Password should not be empty, minimum eight characters maximum fifteen, at least one letter, one number and one special character')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/),
         body('email', 'Invalid email').exists().isEmail(),
        ]   
     }
  }
}
exports.apiValidation   = function(req,resp){
  const errors          = validationResult(req);
  var validationErr     = [];
  var validationErrMesg = [];
  errors.array().forEach(error => {
      let found = validationErr.filter(errItem => error.param === errItem.param);
      if (!found.length) {
        validationErr.push(error);
      }      
  });
  console.log(validationErr);
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
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}
exports.isLoggedIn  = function (req, res, next) {
      // if user is authenticated in the session, carry on 
    var curSession  = req.session;  
    if(curSession.userRec !=  undefined && curSession.userRec.id > 0){
        res.json({ message: "Logged in", status:1 });
        return next();
    }
    res.json({ message: "Logged out", status:0 });
    return;
}
/*-----------------------------------
/-------------LOGOUT USER------------
/---@body: NULL
/------------------------------------
------------------------------------*/
exports.logout   = function(req, res){
  req.session.destroy((err) => {
    if(err) {
      return console.log({message:"Logout Unsuccessfull, please try again", status:0, error:err});
    }
    res.json({message:"Logout successfully, please login again", status:0});    
  });
}

/*-----------------------------------
/-------------LOGIN USER-------------
/---@body: [email, password] --------
/------------------------------------
------------------------------------*/
exports.login  = function(req, resp){
    var postBody  = req.body || null;
    //Add required validation
    theContr.apiValidation(req, resp);
    if(postBody.email != undefined && postBody.password != undefined){
      if(postBody.email){
        theModel.findOne({           
          where: {
           email: postBody.email
         }
        }).then(result => {
            if(result === null || result === undefined){
              resp.json({ message: 'Email Not Exists!',status : 0 });
              return;
            }
            if(result.dataValues.id > 0){
               var getRecord  = result;
               var dbPassword = getRecord.password;
               
              if(!theModel.validPassword(postBody.password, dbPassword)){
                resp.json({ message: 'Password wrong',status : 0 });
                return;
              }
              var userRec = result.dataValues;
              if(req.session != undefined){
                var curSession  = req.session;
                curSession.userRec = userRec;
                resp.json({ message: 'Login success', status : 1});
              }
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
exports.getList = function(req, res) {
  theModel.findAll().then( (result) => res.json(result))
};

/*-----------------------------------
/-------------CREATE USER -----------
/---@body: [id, email,username]------
/------------------------------------
------------------------------------*/
exports.create  = function(req, resp) {    

  //Add required validation
  var validReturn   = theContr.apiValidation(req, resp);
  if(validReturn) return;

  var getData   = req.body || null;
  if(typeof getData === 'object'){
     var getEmail       = getData.email || '';
     var getUserName    = getData.username;
     if(getEmail){
         theModel.findOne({           
           where: {
            [Op.or]: [{email: getEmail}, {username: getUserName}]
          }
         }).then(result => {
           if(result != null){
             resp.json({ message: 'Email/Username Exists',record : result });
             return;
           }
           if(result === null){
            if(getData.password != undefined){
               var hashPassword = theContr.hashPassword(getData.password);
               if(hashPassword) getData.password = hashPassword;
            }
            theModel.create(req.body).then((insertRecord) => {
              if(insertRecord.dataValues.id != undefined &&  insertRecord.dataValues.id > 0){
                resp.json({ message: 'Record Inserted!',status : 1, record: insertRecord });
                return;
              }
            })
          }
        });
     }
     return;
  }
};

/*-----------------------------------
/-------------UPDATE USER -----------
/---@body: [id, email,username]------
/------------------------------------
------------------------------------*/
exports.update = function(req, resp) {
  //Add required validation
  var validReturn   = theContr.apiValidation(req, resp);
  if(validReturn) return;
  var getData     = req.body || null;
  var getId       = req.body.id || 0;
  var getEmail    = req.body.email || '';
  var getUserName = req.body.username || '';
  delete req.body.id;

  if(!getId){
    resp.json({ message: 'ID Not Found',status : -1 }); 
    return;
  }
  else if(getEmail != null && getUserName != null){

      theModel.findAll(
      { where: { 
        [Op.or]: [
          {email: getEmail}, {username: getUserName}
        ], 
        id:
          { [Op.ne] : getId}                        
        }}).then(result => {
          var findRec = result;
          if(findRec.length > 0){
            resp.json({ message: 'Username/Email Exists! please try another',status : 0,record: findRec }); 
            return;
          }
          if(!findRec.length){
            if(getData.password != undefined){
              var hashPassword = theContr.hashPassword(getData.password);
              if(hashPassword) getData.password = hashPassword;
            }
            theModel.update(getData,
            {
              where: {
                id: getId
              }
            }).then((result) => {
              if(result){
                resp.json({ message: 'Record Updated!',status : result });
                return;
              }
              else
                resp.json({ message: 'DB Update Error!',status : result });
                return;
              })
          }
    });
  }   
};
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
        resp.json({ message: 'Record Deleted','status' : result });
      else
        resp.json({ message: 'Record Already Deleted','status' : result });
  })
};
