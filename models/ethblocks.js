/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ethblocks', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true, autoIncrement:true
    },
    blocknumber: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    numberoftxs: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    },
    memo: {
      type: DataTypes.STRING(50),
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
    }
  }, {
    tableName: 'ethblocks'
  });
};
