/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sendpoints', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sitename:{
      type: DataTypes.STRING(15),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    amount: {
      type: DataTypes.INTEGER(10), // BIGINT,
      allowNull: true
    },
    hashcode: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    result:{
      type: DataTypes.INTEGER(3),
      allowNull: true
    }
    , createdat: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
		},
  }, {
    tableName: 'sendpoints'
  });
};
