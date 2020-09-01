/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('txtaskstodo', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    fromaddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    toaddress: {
      type: DataTypes.STRING(100),
      allowNull: true
    },    
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp')
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp')
		},
    netkind: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    failreason: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    blocknumber:{
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    hash: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
    }, {
    tableName: 'txtaskstodo'
  });
};
