'use strict'

const Promise   = require("bluebird");

const db = require('./index');
const sequelize = db.sequelize;

module.exports = (sequelize, DataTypes) => {
  
  const Category = sequelize.define('test_category', {
      test_cat_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      test_cat_name: DataTypes.STRING,
      test_cat_short_name: DataTypes.STRING,
      test_cat_status: DataTypes.STRING    
    },
    {
      freezeTableName: true,
    });  
 return Category;
}

