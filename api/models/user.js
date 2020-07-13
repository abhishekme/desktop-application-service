'use strict'

const Promise = require("bluebird");
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));
var passCrypto  = require('../../config/passCrypto');
var crypto                  = require('crypto');

module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.define('user', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: DataTypes.STRING,
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,      
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      profile_pic: DataTypes.TEXT
    },
    {
      freezeTableName: true,
    });

  // checking if password is valid
  User.validPassword = function(passwordHash, userPassword, dbSalt) {
      let salt = dbSalt;//crypto.randomBytes(16).toString('hex');
      var hashUser = crypto.pbkdf2Sync(userPassword, salt, 1000, 64, `sha512`).toString(`hex`); 
      //console.log("DB Hash: ", passwordHash);
      //console.log("Entered Hash: ", hashUser);
      //console.log("check: ", hashUser === passwordHash);
      return hashUser === passwordHash; 

    //let hash = bcrypt.hashSync(userPassword, bcrypt.genSaltSync(10));
    // let passObj = JSON.parse(passwordHash);
    // console.log("ddd ", passObj, " -- ", passwordHash);
    // let decryptPass = passCrypto.decrypt(passwordHash);
    // console.log("decrypt ver: ", passObj);
    // console.log('check: ',passwordHash," :: ", userPassword, " -- ");
    // //check pass
    // bcrypt.compare(userPassword, passwordHash, function(err, isMatch) {
    //   if (err) {
    //     throw err
    //   } else if (!isMatch) {
    //     console.log("Password doesn't match!")
    //   } else {
    //     console.log("Password matches!")
    //   }
    // })
    // bcrypt.compare(userPassword, passwordHash, function(err, result) {
    //   // result == true
    //   console.log('result check: ',result);
    //   return result
    // });
    // if(bcrypt.compareSync(userPassword, passwordHash)) {
    //   // Passwords match
    //   console.log('match pass');
    //  } else {
    //   console.log('not match pass');
    //   // Passwords don't match
    //  }
    //return bcrypt.compareSync(password, localPassword);
 }
 return User;

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
