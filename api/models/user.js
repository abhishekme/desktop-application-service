'use strict'

const Promise = require("bluebird");
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));


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
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,      
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      profile_pic: DataTypes.TEXT
    },
    
    {
      tableName: 'user',
      freezeTableName: true,
      /*hooks: {
        beforeCreate: function(member, options) {
          const SALT_FACTOR = 10;
          console.log('#### ',member);
          if (!member.changed('password')) {
            return sequelize.Promise.reject("not modified");
          }
          
          bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
            if (err) return sequelize.Promise.reject(err);
  
            bcrypt.hash(member.password, salt, null, function(err, hash) {
              console.log('Hash creating...', member.password, " :: ", hash);
              if (err) return sequelize.Promise.reject(err);
              if(hash != null) member.password = hash; 
              //member.setDataValue('password', hash);
            });
          });
        }
      }*/
     }     
  );

  // checking if password is valid
  User.validPassword = function(password, localPassword) {
    return bcrypt.compareSync(password, localPassword);
 }
  


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
  

  return User;
}
