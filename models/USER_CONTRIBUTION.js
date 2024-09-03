const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "USER_CONTRIBUTION",
    {
      id: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "USER_INFO",
          key: "user_id",
        },
        unique: "user_contribution_user_id_foreign",
      },
      cont_id: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        references: {
          model: "CONTRIBUTION_INFO", // 외래 키 참조를 설정
          key: "cont_id",
        },
        unique: "user_contribution_cont_id_foreign",
      },
      ms_1_id: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        unique: "user_contribution_ms_1_id_unique",
      },
      ms_1_ret: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ms_1_yn: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "N",
      },
      ms_2_id: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        unique: "user_contribution_ms_2_id_unique",
      },
      ms_2_ret: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ms_2_yn: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "N",
      },
      ms_3_id: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        unique: "user_contribution_ms_3_id_unique",
      },
      ms_3_yn: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ms_3_ret: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "N",
      },
      cont_yn: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "N",
      },
      cont_reward: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "USER_CONTRIBUTION",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "user_contribution_user_id_unique",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
        {
          name: "user_contribution_cont_id_unique",
          unique: true,
          using: "BTREE",
          fields: [{ name: "cont_id" }],
        },
        {
          name: "user_contribution_ms_1_id_unique",
          unique: true,
          using: "BTREE",
          fields: [{ name: "ms_1_id" }],
        },
        {
          name: "user_contribution_ms_2_id_unique",
          unique: true,
          using: "BTREE",
          fields: [{ name: "ms_2_id" }],
        },
        {
          name: "user_contribution_ms_3_id_unique",
          unique: true,
          using: "BTREE",
          fields: [{ name: "ms_3_id" }],
        },
      ],
    }
  );
};
