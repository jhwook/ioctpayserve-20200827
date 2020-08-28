/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ethgasestimates', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true, autoIncrement: true
    },
    gaspricehex: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    gaspriceweistr: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    gaspricefloat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    gaslimithex: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    gaslimitweistr: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    gaslimitfloat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    netkind: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    gaspricehexinuse: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    gaspriceweiinusestr: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    gaslimithexinuse: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    gaslimitweiinusestr: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    ratiopriceuseoverest: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ratiolimituseoverest: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  }, {
    tableName: 'ethgasestimates'
  });
};
