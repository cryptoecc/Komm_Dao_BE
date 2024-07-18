const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USER_DEAL_INTEREST', {
    deal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    int_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: "update 가능"
    },
    final_allocation: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    final_int_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    payment_status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    transaction_link: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    update_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'USER_DEAL_INTEREST',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "deal_id" },
          { name: "user_id" },
        ]
      },
      {
        name: "idx_user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
