
//var models  = require('../models/index');
const User = require('../models/userModel.js');



async function list_user() {


}

list_user();


//exports.list_all_users = function(req, res) {
  //User.find({}).limit(5);

  /*User.find()
  .where(1).exec(function(err, users){
    if (err){
       return res.send(403, 'Failed to find users' + JSON.stringify(err));
    }
    console.log('Load Date: ',res.json());
    // res.view('admin/users', {
    //   users: users
    // });

  });*/
//   console.log("My Model: ",User);

//   User.list(function(err, User) {
//     if (err)
//       res.send(err);
//     res.json(User);
//   });

//   User.where({'id':16}).fetch().then(function(user) {
//     console.log("List User: ",user.toJSON());
//     return user.toJSON();
//   }).catch(function(err) {
//     console.error("Model Error: ", err);
//   });




  //models.users.findAll({ limit: 10 }).then(users => res.json(users));

//   models.User.findAll({
//     //include: [ models.Task ]
//   }).then(function(users) {
//     res.render('index', {
//       title: 'Sequelize: Express Example',
//       users: users
//     });
//   });

//};

/*
exports.create_a_User = function(req, res) {
  var record = new User(req.body);
  var result = JSON.parse(JSON.stringify(record));
  console.log(record.first_name, " :: ",record, " ==> ", result);

    if(record.first_name === undefined){
        res.status(400).send({ error:true, message: 'Please provide User Details [first_name,last_name,email,username]' });
    }
    else{
        //Check Existing Email
        let getEmail    = record.email;    
        User.getEmail(getEmail, function(err, rest){
            if(rest.length > 0 ){
                //Record Found - Notify User
                res.status(400).send({ error:true, message: 'Given Email Exists, Please use another email' });
            }
            if(rest.length == 0 ){
                User.createUser(record, function(err, User) {
                    if (err)
                        res.send(err);
                    res.status(400).send({ status:1, message: 'New User Inserted'});
                    res.json(User);
                });
            }
        });
    }
};

exports.getUserById = function(req, res) {
  if(!req.query.userId){
    res.status(400).send({ error:true, message: 'Please provide User ID [id]' });
  }
  User.getUserById(req.query.userId, function(err, User) {
    if (err)
      res.send(err);
    res.json(User);
  });
};

exports.getUserByEmail = function(req, res) {
    let get_Email   = '';
    if(req.query != undefined){
        getEmail    =   req.query.email;
    }else{
        getEmail    =   req;
    }
    if(!get_Email){
        res.status(400).send({ error:true, message: 'Please provide User Email [email]' });
    }
    else{  
        User.getEmail(get_Email.email, function(err, User) {
            if (err)
                res.send(err);
            res.json(User);
        });
    }
};

exports.update_a_User = function(req, res) {  
  User.updateById((req.body), function(err, User) {
    if (err)
      res.send(err);
    res.json(User);
  });
};

exports.delete_a_User = function(req, res) {
  User.remove( req.query.userId, function(err, User) {
    if (err)
      res.send(err);
    res.json({ message: 'User successfully deleted','record' : User });
  });
};
*/