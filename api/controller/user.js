'use strict'

//Get ORM object
const { body }              = require('express-validator');
const { validationResult }  = require('express-validator');
const Sequelize             = require('sequelize');
const Op          = Sequelize.Op;
const db          = require("../models");
const theModel    = db.user; 

//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------
exports.validate = (method) => {
  console.log('validation @ '+method);
  switch (method) {    
    case 'create' : {
     return [ 
        body('username', 'userName doesn\'t exists').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('first_name', 'First name is required').exists(),
        body('password', 'Password is required').exists(),
       ]   
    }
    case  'update' : {
      return [ 
         body('username', 'userName doesn\'t exists').exists(),
         body('email', 'Invalid email').exists().isEmail(),
         body('first_name', 'First name is required').exists(),
         body('password', 'Password is required').exists(),
        ]   
     }
  }
}
//-----------------------------------------------------------------------
//---------------- API Required Field Validation ------------------------
//-----------------------------------------------------------------------

//Add List with pagination limit
exports.getList = function(req, res) {
  theModel.findAll().then( (result) => res.json(result))
};

exports.create  = function(req, resp) {    
  //Check validation input
  const errors          = validationResult(req);
  var validationErr     = [];
  var validationErrMesg = [];
  errors.array().forEach(error => {
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
    return;
  }

  var getData   = req.body || null;

  if(typeof getData === 'object'){
     var getEmail       = getData.email || '';
     var getUserName    = getData.username;
     if(getEmail){
         theModel.findAll({           
           where: {
            [Op.or]: [{email: getEmail}, {username: getUserName}]
          }
         }).then(result => {
           if(result.length){
             resp.json({ message: 'Email/Username Exists',record : result });
             return;
           }
           if(!result.length){
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
  else{
    resp.json({ message: 'Unhandled Exception,Validation Required[first_name,email,password,username] ',status : 0 });
    return;
  } 
};

exports.update = function(req, resp) {

  const errors          = validationResult(req);
  console.log('Update Validation ', errors);


  var getId       = req.body.id || 0;
  var getEmail    = req.body.email || '';
  var getUserName = req.body.username || '';
  delete req.body.id;

  //Call validator
  //validate('update');
  //id: {$ne: getId}, 
  //{[Op.or]: [{email: getEmail}, {username: getUserName}]}
  //Sequelize.literal('id != ' + getId),

  if(!getId){
    resp.json({ message: 'ID Not Found',status : -1 }); 
    return;
  }
  else if(getEmail != null && getUserName != null){

    theModel.findAll({ where: { 
                        [Op.or]: [
                          {email: getEmail}, {username: getUserName}
                        ], 
                        id:
                          { [Op.ne] : 2}                        
                        }}).then(result => {
      //console.log("Find Record: ", result);
      var findRec = result;
      if(findRec.length){
        resp.json({ message: 'Username/Email Exists! please try another',status : 0,record: findRec }); 
        return;
      }
      if(!findRec.length){
        theModel.update((req.body),
        {
          where: {
            id: getId
          }
        }).then((result) => {
          if(result)
            resp.json({ message: 'Record Updated!',status : result });
          else
            resp.json({ message: 'DB Update Error!',status : result });
          })
      }
    });

    /*theModel.findAll({
      where: 
      { email: getEmail } 
    }).then(result => {
      console.log("GET Record: ", result);
      var findRec = result.find(rec => rec.id != getId);
      console.log("Find Record: ", findRec);
      if(findRec != null){
        resp.json({ message: 'Email Exists! please try another',status : 0,record: findRec }); 
        return;
      }if(findRec == undefined){
        theModel.update((req.body),
        {
          where: {
            id: getId
          }
        }).then((result) => {
          if(result)
            resp.json({ message: 'Record Updated!',status : result });
          else
            resp.json({ message: 'DB Update Error!',status : result });
          })
      }
    });*/
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



// var userController = {

//   getList = () => function(req, resp){
//     theModel.findAll().then( (result) => res.json(result))
//   }

// }
// module.exports  = userController;


// exports.getList = function(req, res) {
//   if(!req.query.userId){
//     res.status(400).send({ error:true, message: 'Please provide User ID [id]' });
//   }
//   User.getUserById(req.query.userId, function(err, User) {
//     if (err)
//       res.send(err);
//     res.json(User);
//   });
// };

//module.exports = (app,db) => {

  //getList = () => function(req, resp){
    //theModel.findAll().then( (result) => res.json(result))
  //}

  // app.get( "/user", (req, res) =>
  //   theModel.findAll().then( (result) => res.json(result))
  // );

  // app.get( "/post/:id", (req, res) =>
  //   db.post.findByPk(req.params.id).then( (result) => res.json(result))
  // );

  // app.post("/post", (req, res) => 
  //   db.post.create({
  //     title: req.body.title,
  //     content: req.body.content
  //   }).then( (result) => res.json(result) )
  // );

  // app.put( "/post/:id", (req, res) =>
  //   db.post.update({
  //     title: req.body.title,
  //     content: req.body.content
  //   },
  //   {
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then( (result) => res.json(result) )
  // );

  // app.delete( "/post/:id", (req, res) =>
  //   db.post.destroy({
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then( (result) => res.json(result) )
  // );
//}