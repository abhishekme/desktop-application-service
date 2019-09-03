'use strict'

//Get ORM object
var userController  = require('./user');
var bCrypt          = require('bcrypt-nodejs');
var passport        = require('passport')

const { body }              = require('express-validator');
const { validationResult }  = require('express-validator');
const Sequelize             = require('sequelize');
const Op                    = Sequelize.Op;
const db                    = require("../models");
const theModel              = db.user; 
const theContr              = userController;

var LocalStrategy = require('passport-local').Strategy;

//console.log('"LocalStrategy: ', LocalStrategy);

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {
  switch (method) {
    case 'signup' : {
      return [ 
        body('first_name', 'First name is required').exists(),
        body('last_name', 'Last name is required').exists(),
        body('username', 'UserName is required').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('password', 'Password is required').exists(),
       ]   
    }
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
    return false;
  }
}
//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------

exports.hashPassword  = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}
exports.isLoggedIn  = function (req, res, next) {
      // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        res.json({ message: "Logged in", status:1 });
        return;
    }
    res.json({ message: "Logged out", status:0 });
    return;
    //return next();
    // if they aren't redirect them to the home page
    //res.redirect('/');
}


//For User Signup
exports.login  = function(req, resp){
    var postBody  = req.body || null;
    console.log(postBody);
    theContr.apiValidation(req, resp);
    return;
    if(postBody.email != undefined && postBody.password != undefined){
      if(postBody.email){
        theModel.findOne({           
          where: {
           email: postBody.email
         }
        }).then(result => {
            if(result === null || result === undefined){
              resp.json({ message: 'Email Not Found',status : 0 });
              return;
            }
            console.log('@User Get Data: ',result.dataValues);
            if(result.dataValues.id > 0){
               var getRecord  = result;
               var dbPassword = getRecord.password;
               
              // if(!theModel.validPassword(postBody.password, dbPassword)){
              //   resp.json({ message: 'Password wrong',status : 0 });
              //   return;
              // }

              // if(theContr.isLoggedIn(req,resp)){
              //   resp.json({ message: 'Logged in',status : 1 });
              //   return;
              // }

              console.log('@@@@@@@ Passport Auth');

              passport.authenticate('local')(req, res, function () {
                console.log('Passport Authenticate: ', req);



              });


              /*passport.use(new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password'
                },
                function(email, password, cb) {
                  console.log('@Entered Email: ',email, 'password: ', password);
                  theModel.findOne({
                        where: {
                            email: email
                        },
                        raw : true
                    }).then(function(user){
                        console.log('Passport User: ', user);
                        if (!user) { return cb(null, false); }
                        if (user.password != password) { return cb(null, false); }
                        return cb(null, user);
                    }).catch(function(error){
                        if (error) { return cb(null, error); }
                    });
                }));*/

                resp.json({ message: 'Login success',status : 1 });
                return;
           }
        });
      }      
    }
}


//Add List with pagination limit
exports.getList = function(req, res) {
  console.log('####### USER LIST ###############');
  theModel.findAll().then( (result) => res.json(result))
};

exports.create  = function(req, resp) {    

  //Fetch Methods Validation
  theContr.apiValidation(req, resp);

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
           if(result.length){
             resp.json({ message: 'Email/Username Exists',record : result });
             return;
           }
           if(!result.length){
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

exports.update = function(req, resp) {
  //Fetch Methods Validation
  theContr.apiValidation(req, resp);
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
          if(findRec.length){
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
              }
              else
                resp.json({ message: 'DB Update Error!',status : result });
              })
          }
    });
  }   
  return;
};

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
