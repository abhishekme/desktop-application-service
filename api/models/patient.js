'use strict'

const Promise   = require("bluebird");

module.exports = (sequelize, DataTypes) => {
  
  const Patient = sequelize.define('patient', {
    pt_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      pt_case_id: {
          type:DataTypes.INTEGER(10),
          allowNull: false,
      },
      pt_name: DataTypes.STRING,
      pt_addr: DataTypes.STRING,
      pt_email: DataTypes.STRING,
      pt_mobile: DataTypes.STRING,
      pt_case_history: DataTypes.STRING,  
      pt_case_date: DataTypes.DATE,
      pt_bill_amt: DataTypes.DOUBLE(10,2),      
    },
    {
      freezeTableName: true,
    });  
 return Patient;  
}
