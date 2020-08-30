/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('marketprices', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    BTC: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ETH: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    XRP: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    units: {
      type: DataTypes.STRING(15),
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
    }
  }, {
    tableName: 'marketprices'
  });
};
