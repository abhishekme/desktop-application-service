'use strict'

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// var SequelizeAuto = require('sequelize-auto');
// //var auto = new SequelizeAuto(config.database, config.username, config.password);
// //With options:
// var auto = new SequelizeAuto(config.database, config.username, config.password, {
//   host: config.host,
//   dialect: config.dialect,
//   directory: false, // prevents the program from writing to disk
//   port: config.port,
//   additional: {
//       timestamps: false
//   },
//   tables: ['users']
// });
// auto.run(function (err) {
//   if (err) throw err;
//   //console.log(auto.tables); // table list
//   //console.log(auto.foreignKeys); // foreign key list
// });

//With options:
// var auto = new SequelizeAuto(config.database, config.username, config.password, {
//     host: config.host,
//     dialect: config.dialect,
//     directory: false, // prevents the program from writing to disk
//     port: config.port,
//     additional: {
//         timestamps: false
//     },
//     tables: ['users']
// });

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
