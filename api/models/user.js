'use strict'

module.exports = (sequelize, DataTypes) => {
  
  const User = sequelize.define('user', {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      username: DataTypes.STRING,      
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      profile_pic: DataTypes.TEXT
    },
    {
      tableName: 'user',
      freezeTableName: true,
    }
  );
  //ORM Relations
  // Post.associate = (models) => {
  //   Post.belongsTo(models.author);
  // };
  return User;
}
