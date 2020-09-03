/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tokens', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    decimals: {
      type: DataTypes.INTEGER(3),
      allowNull: true
    },
    supply: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },    
    netkind: {
      type: DataTypes.STRING(10),
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
		MINAMOUNT_TOWITHDRAW: {
      type: DataTypes.INTEGER(10),
      allowNull: true
		},
		MAXAMOUNT_TOWITHDRAW:{
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    symbol:{
      type: DataTypes.STRING(15),
      allowNull: true
    },    denominatorexp:{
      type: DataTypes.INTEGER(10),
      allowNull: true
    }, group_:{
      type: DataTypes.STRING(15),
      allowNull: true
    }, nettype:{
      type: DataTypes.STRING(15),
      allowNull: true
    }
    }, {
    tableName: 'tokens'
  });
};
