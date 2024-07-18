const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DELEGATE_INFO', {
    delegate_id: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      primaryKey: true
    },
    delegate_from: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'USER_INFO',
        key: 'user_id'
      }
    },
    delegate_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'USER_INFO',
        key: 'user_id'
      }
    },
    delegate_transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'DELEGATE_INFO',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "delegate_id" },
        ]
      },
      {
        name: "delegate_info_delegate_to_foreign",
        using: "BTREE",
        fields: [
          { name: "delegate_to" },
        ]
      },
      {
        name: "delegate_info_delegate_from_foreign",
        using: "BTREE",
        fields: [
          { name: "delegate_from" },
        ]
      },
    ]
  });
};
