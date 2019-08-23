'user strict';

var knex          = require('./index');
var bookshelf     = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'user'
});


// User.list   =   function(err, result){
//     if(err)
//      return result.toJson();
//       //result(null, err);
//     //result(null, res);
// };
module.exports  = User;



// module.exports = (sequelize, type) => {
//     return sequelize.define('Test', {
//         id: {
//           type: type.INTEGER,
//           primaryKey: true,
//           autoIncrement: true
//         },
//         first_name: type.STRING
//     })
// }

// module.exports = (sequelize, DataTypes) => {
//     const User = sequelize.define('user', {
//       username: DataTypes.STRING
//     });
  
//     // User.associate = function(models) {
//     //   models.User.hasMany(models.Task);
//     // };
  
//     return User;
//   };

/*module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      name: DataTypes.STRING,
      surname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    }, {});
    User.associate = function(models) {
      // associations can be defined here
    };
    return User;
  };




const User = function(user){
    this.id             = user.id;
    this.first_name     = user.first_name;
    this.last_name      = user.last_name;
    this.email          = user.email;
    this.username       = user.username;
    //this.password     = user.password;
    //this.status = task.status;
    //this.created_at = new Date();
};*/


/*
var Waterline = require('waterline');


// Define your collection (aka model)
var User = Waterline.Collection.extend({
  // Define a custom table name
  tableName: 'user',
  // Set schema true/false for adapters that support schemaless
  schema: false,  
  // Define an adapter to use
  adapter: 'mysql',

  attributes: {
    id: {
        type: 'integer',
        required: false,
        primary:true
      },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true,
    },
    username: {
        type: 'string',
        required: false,
    },
    email: {
        type: 'string',
        required: true,
    },
    password: {
        type: 'string',
        required: true,
    },
    address: {
        type: 'string',
        required: false,
    },
    country_id: {
        type: 'integer',
        required: false,
    },
    state_id: {
        type: 'integer',
        required: false,
    },
    city_id: {
        type: 'integer',
        required: false,
    },
    is_admin: {
        type: 'integer',
        required: false,
    },
  },

  beforeCreate: function(values, cb) {
    // An example encrypt function defined somewhere
    encrypt(values.password, function(err, password) {
      if(err) return cb(err);
      values.password = password;
      cb();
    });
  },

  // Class Method
  doSomething: function() {
    // Do something here
  }

});*/


/*
var sql = require('../connection/connection.js');

//User object constructor :: Table -> user
var User = function(user){
    this.id             = user.id;
    this.first_name     = user.first_name;
    this.last_name      = user.last_name;
    this.email          = user.email;
    this.username       = user.username;
    //this.password     = user.password;
    //this.status = task.status;
    //this.created_at = new Date();
};

User.createUser = function (newUser, result) {
        sql.query("INSERT INTO ng_user set ?", newUser, function (err, res) {
                
                if(err) {
                    result(err, null);
                }
                else{
                    console.log("New User Inserted: ",res.insertId);
                    result(null, res.insertId);
                }
            });           
};
User.getEmail = function(userEmail, result){
    sql.query("Select * from ng_user where email = ? ", userEmail, function (err, res) {             
        if(err) {
            result(err, null);
        }
        else{
            result(null, res);      
        }
    });
}
User.getUserById = function (userId, result) {
        sql.query("select * from ng_user where id = ? ", userId, function (err, res) {             
                if(err) {
                    result(err, null);
                }
                else{
                    result(null, res);
                }
            });   
};
User.getList = function (result) {
        sql.query("Select * from ng_user", function (err, res) {
                if(err) {
                    result(null, err);
                }
                else{
                    result(null, res);
                }
            });   
};
User.updateById = function(user, result){
  var userId = user.userId;
  delete user.userId;
  sql.query("UPDATE ng_user SET ? WHERE id = ?", [user, userId], function (err, res) {
          if(err) {
                console.log("Update User Error: ", err);
                result(null, err);
             }
           else{   
                result(null, res);
                }
            }); 
};
User.remove = function(id, result){
     sql.query("DELETE FROM ng_user WHERE id = ?", [id], function (err, res) {

                if(err) {
                    result(null, err);
                }
                else{               
                 result(null, res);
                }
            }); 
};
*/

//module.exports= User;