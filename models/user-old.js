/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user-old', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true
		},
		first_name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		last_name: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		password: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		address: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		profile_pic: {
			type: DataTypes.STRING(45),
			allowNull: true
		},
		country_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		state_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		city_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true
		},
		is_admin: {
			type: DataTypes.INTEGER(5),
			allowNull: true
		},
		createdAt: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		updatedAt: {
			type: DataTypes.DATEONLY,
			allowNull: true
		}
	}, {
		tableName: 'user-old'
	});
};
