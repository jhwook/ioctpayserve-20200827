module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sitenameholder', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: true,
      comment: null,
      field: "id"
    },
    sitename: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "sitename",
      unique: "sitename"
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "createdat"
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp'),
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "updatedat"
    }
    ,nettype:{
      type: DataTypes.STRING(15),
      allowNull: true,
    }
    ,urladdress:{
      type: DataTypes.STRING(100),
      allowNull: true,
    }
    , active:{
      type: DataTypes.INTEGER(4),
      allowNull: true
    }
  }, {
    tableName: 'sitenameholder'
  });
}