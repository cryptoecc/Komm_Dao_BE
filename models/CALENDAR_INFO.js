const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "CALENDAR_INFO",
    {
      cal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        comment: "Calendar ID",
      },
      pjt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PROJECT_INFO",
          key: "pjt_id",
        },
        comment: "Project ID",
      },
      pjt_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Project Name",
      },
      key_word: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Calendar Keyword",
      },
      cal_detail: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Calendar Detail Text",
      },
      x_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Project Twitter Link",
      },
      x_detail_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Calendar Detail Link",
      },
      create_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "Create Date",
        defaultValue: DataTypes.NOW,
      },
      update_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "Update Date",
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "CALENDAR_INFO",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "cal_id" }],
        },
        {
          name: "calendar_info_pjt_id_foreign",
          using: "BTREE",
          fields: [{ name: "pjt_id" }],
        },
      ],
    }
  );
};
