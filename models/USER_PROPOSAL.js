const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "USER_PROPOSAL",
    {
      prop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      vote_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "comm_code = vote_status",
      },
      comments: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      voted_power: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "USER_PROPOSAL",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "prop_id" }, { name: "user_id" }],
        },
        {
          name: "idx_prop_id_unique", // prop_id에 고유 인덱스 추가
          unique: true,
          using: "BTREE",
          fields: [{ name: "prop_id" }],
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
