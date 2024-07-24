const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "USER_INFO",
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "USER_PROPOSAL",
          key: "user_id",
        },
      },
      user_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email_addr: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      wallet_addr: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      expertise: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment:
          "COMM_CODE = USER_EXPERTISE USER_INV USER_RES USER_DEV USER_MAR USER_DES USER_LAW USER_HH",
      },
      bio: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      value_add: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      reg_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      appr_status: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cur_xp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      last_login_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nft_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      user_image_link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      voting_power: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "update vote power",
      },
      activate_yn: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "N",
        comment: "active user (approval user)",
      },
    },
    {
      sequelize,
      tableName: "USER_INFO",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );
};
