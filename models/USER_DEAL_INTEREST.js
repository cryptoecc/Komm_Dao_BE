const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "USER_DEAL_INTEREST",
    {
      deal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // 복합 기본 키의 일부
        references: {
          model: "DEAL_INFO", // 외래 키 참조 설정
          key: "deal_id",
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, // 복합 기본 키의 일부
      },
      user_interest: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        comment: "update 가능",
      },
      user_final_alloc: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      payment_amount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      payment_status: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      payment_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      create_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      update_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "USER_DEAL_INTEREST",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "deal_id" }, { name: "user_id" }],
        },
        {
          name: "idx_user_id",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
};
