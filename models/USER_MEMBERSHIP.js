const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "USER_MEMBERSHIP",
    {
      token_id: {
        autoIncrement: false,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      ipfs_cid: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      animation_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contract_addr_proxy: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "USER_MEMBERSHIP",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "token_id" }],
        },
      ],
    }
  );
};
