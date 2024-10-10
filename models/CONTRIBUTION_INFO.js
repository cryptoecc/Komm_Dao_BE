const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "CONTRIBUTION_INFO",
    {
      cont_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      pjt_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PROJECT_INFO",
          key: "pjt_id",
        },
      },
      pjt_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cont_type: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment:
          "COMM_CODE = CONT_TYPE CON_COM_ENA CON_NOD_VAL CON_RES CON_MAR",
      },
      cont_category: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cur_participant: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      max_participant: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      cont_logo: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cont_banner: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cont_desc: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      cont_xp: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      cont_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: "PENDING",
      },
    },
    {
      sequelize,
      tableName: "CONTRIBUTION_INFO",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "cont_id" }],
        },
      ],
    }
  );
};
