'use strict'

//Get ORM object
const Sequelize = require('sequelize');
const db          = require("../models");
const theModel    = db.user; 
const config = require('../../config/config.json');
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: 'localhost',
  dialect: 'mysql'
});

exports.getList = function(req, res) {
  theModel.findAll().then( (result) => res.json(result))
};

exports.create  = function(req, resp) {
  var getData   = req.body || null;  
  console.log("Input: ",getData.length)
  if(typeof getData === 'object'){
     var getEmail   = getData.email || '';
     if(getEmail){
         theModel.findAll({  
           where: {
             email : getEmail  
           }
         }).then(result => {
           console.log('result status: ',result.length);
           if(result.length){
             resp.json({ message: 'Email Exists',record : result });
             return;
           }
           if(!result.length){
            theModel.create(req.body).then((insertRecord) => {
              //console.log('DB Insert Return: ',result.dataValues.id, " ==> ", result.dataValues.length);
              if(insertRecord.dataValues.id != undefined &&  insertRecord.dataValues.id > 0){
                resp.json({ message: 'Record Inserted!',status : 1, record: insertRecord });
                return;
              }
            })
          }
         });
     }
  }
  if(getData == null){
    resp.json({ message: 'Body Empty',status : 0 });
                return;
  } 
};

exports.update = function(req, resp) {

  var getId       = req.body.id;
  var getEmail    = req.body.email || '';
  delete req.body.id;

  if(!getId){
    resp.json({ message: 'ID Not Found',status : -1 }); 
    return;
  }
  else if(getEmail != null){
    console.log('checking Email.....');
    theModel.findAll({
      where: 
      { email: getEmail } 
    }).then(result => {
      var findRec = result.find(rec => rec.id != getId);
      if(findRec != null){
        resp.json({ message: 'Email Exists! please try another',status : 0,record: findRec }); 
        return;
      }
      console.log('CheckEmail !update: ', result);
    });
  } 
  //return;  
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
};

exports.delete = function(req, resp) {
  theModel.destroy({
    where: {
      id: req.query.id
    }
  }).then((result) => {
      console.log(result);
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