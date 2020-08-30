/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exchangerates', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    currency0: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    currency1: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    amount0: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    amount1: {
      type: DataTypes.INTEGER(10).UNSIGNED,
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
    partitionratios: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    sitename:{
      type: DataTypes.STRING(20),
      allowNull: true
    }    , C:{
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    }    , S:{
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    }    , K:{
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
  } , 
  }, {
    tableName: 'exchangerates'
  });
};
