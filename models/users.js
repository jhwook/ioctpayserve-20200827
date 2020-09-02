/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    withdrawpw: {
      type: DataTypes.STRING(20),
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
    preflang:{
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'KOR'
    }    , pw:{
      type: DataTypes.STRING(10),
      allowNull: true,
    }
    , active:{
      type: DataTypes.INTEGER(3),
      allowNull: true,
    }
  }, {
    tableName: 'users'
  });
};
