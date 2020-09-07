/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
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
    fromamount: {
      type: DataTypes.DECIMAL, // BIGINT,
      allowNull: true
    },
    toamount: {
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
    direction: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    blocknumber:{
      type: DataTypes.INTEGER(10),
      allowNull: true
    }
    ,createdat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp')
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.fn('current_timestamp')
    }
    , kind: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
    , description: {
      type: DataTypes.STRING(50),
      allowNull: true
    }    ,
    hash: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
    , amountbefore: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
    , amountafter: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }    , 
    netkind: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    fee :{
      type: DataTypes.BIGINT,
      allowNull: true
    },
    gaslimitbid :{
      type: DataTypes.BIGINT,
      allowNull: true
    },
    gaslimitoffer :{
      type: DataTypes.BIGINT,
      allowNull: true
    },
    gasprice:{
      type: DataTypes.BIGINT,
      allowNull: true
    },
    fee :{
      type: DataTypes.BIGINT,
      allowNull: true
    },
    amountfloatstr:{
      type: DataTypes.STRING(15),
      allowNull: true
    },
    txtime:{
      type: DataTypes.STRING(20),
      allowNull: true
    },
    nettype:{
      type: DataTypes.STRING(15),
      allowNull: true
    },
    feestr:{
      type: DataTypes.STRING(15),
      allowNull: true
    },
  }, {
    tableName: 'transactions'
  });
};
