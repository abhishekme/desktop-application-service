'use strict'

const Promise   = require("bluebird");
const bcrypt    = Promise.promisifyAll(require('bcrypt-nodejs'));
var passCrypto  = require('../../config/passCrypto');
var crypto      = require('crypto');

module.exports = (sequelize, DataTypes) => {
  
  const user = sequelize.define('user', {
      id: { 
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      //password: DataTypes.STRING,      
      email: DataTypes.STRING,
      //username: DataTypes.STRING,
      mobile: DataTypes.STRING,
      address: DataTypes.STRING,
      user_avatar: DataTypes.STRING, 
    },
    {
      freezeTableName: true,
    });

  // checking if password is valid
//   User.validPassword = function(passwordHash, userPassword, dbSalt) {
//       let salt = dbSalt;//crypto.randomBytes(16).toString('hex');
//       var hashUser = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, `sha512`).toString(`hex`); 
//       return hashUser === passwordHash; 
//  }
 return user;

  //ORM Relations
  // Post.associate = (models) => {
  //   Post.belongsTo(models.author);
  // };
    /*
    {
    hooks: {
      beforeCreate: (user) =>{
        const salt = bcrypt.genSalt(10);
        const passwordHash = bcrypt.hash(user.password, salt);
        user.password = passwordHash;
        console.log("hook called : ",user);
        return user;
        return new Promise((resolve,reject) => {
          const salt = bcrypt.genSalt(10);
          const passwordHash = bcrypt.hash(userModel.password, salt);
          userModel.password = passwordHash;
          console.log('simple pass', userModel.password);
          console.log('hashed password', passwordHash);
          return resolve(userModel);
        });  
      }
    }
  },

    */
  /*User.beforeCreate(function(user, options) {
    return hashPassword(user.password).then(function (hashedPw) {
      console.log('Password Encrypt: ',hashedPw);
      user.password = hashedPw;
    });
  })*/
  // User.generateHash = function(userModel) {
  //   //models.User.hasMany(models.Task);
  //   const salt = bcrypt.genSalt(10);
  //   passwordHash = bcrypt.hash(userModel.password, salt);
  //   console.log('Hash Passwwd: ', passwordHash);
  //   return passwordHash;
  // };

  // User.beforeCreate(function(user, options, cb) {
  //   console.log('Info: ' + 'Storing the password', user); 
  //   user.generateHash('11111111');   
  //   // user.generateHash(user.password, function(err, encrypted) {
  //   //   if (err) return cb(err);
  //   //   console.log('Info: ' + 'getting ' + encrypted);
  
  //   //   user.password = encrypted;
  //   //   console.log('Info: ' + 'password now is: ' + user.password);
  //   //   return cb(null, options);
  //   // });
  // });
  
}
