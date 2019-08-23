'use strict';

// var fs        = require('fs');
// var path      = require('path');
// var Sequelize = require('sequelize');
// var basename  = path.basename(__filename);
// var env       = process.env.NODE_ENV || 'development';
// //var config    = require(__dirname + '/../config/config.js')[env];
// var config = require("../connection/config.js");
// const UserModel = require('./userModel')

// var db        = {};


// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
// var sequelize = new Sequelize(config.adapter[0].sql.database, config.adapter[0].sql.username, config.adapter[0].sql.password, {
//     dialect: 'sqlite',
// });


// const pathDb = 'mysql://root:root@localhost:3306/local-chat';
// const sequelize = new Sequelize(pathDb, {
//     operatorsAliases: false
// });

/*const sequelize = new Sequelize(config.adapter[0].sql.database, config.adapter[0].sql.user, config.adapter[0].sql.password, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
  //Checking connection status
sequelize.authenticate().complete(function (err) {
    if (err) {
       console.log('There is connection in ERROR');
    } else {
       console.log('Connection has been established successfully');
    }
   });*/


/*fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});*/

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.user      = UserModel;

// module.exports = db;

var config = require("../connection/config.js");
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : config.adapter[0].sql.host,
    user     : config.adapter[0].sql.user,
    password : config.adapter[0].sql.password,
    database : config.adapter[0].sql.database,
    charset  : 'utf8'
  }
});
module.exports = knex;

