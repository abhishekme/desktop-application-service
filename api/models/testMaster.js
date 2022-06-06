'use strict'

const Promise   = require("bluebird");

module.exports = (sequelize, DataTypes) => {
  
  const testMaster = sequelize.define('test_master', {
    test_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    test_cat_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false
    },
      test_name: DataTypes.STRING,
      test_status: DataTypes.BOOLEAN,
      test_amount: DataTypes.DOUBLE(10,2)
    },
    {
      freezeTableName: true,
    });  
 return testMaster;  
}
