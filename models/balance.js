/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('balance', {
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
    amountfloat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },    
    amountstr: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    amountlocked: {
      type: DataTypes.BIGINT,
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
		address: {
      type: DataTypes.STRING(100),
      allowNull: true
		},
		privatekey:{
      type: DataTypes.STRING(100),
      allowNull: true
    }
    , canwithdraw:{
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    }
    , denominatorexp:{
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    } , kind: {
      type: DataTypes.STRING(15),
      allowNull: true
    }
    , netkind: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
    , blocknumber : {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true
    }
    }, {
    tableName: 'balance'
  });
};
