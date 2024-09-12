const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "DEAL_INFO",
    {
      deal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      pjt_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "PROJECT_INFO",
          key: "pjt_id",
        },
      },
      deal_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "deal_name = project_name + deal_round",
      },
      deal_round: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment:
          "COMM_CODE = DEAL_ROUND DEAL_PRESEED DEAL_SEED DEAL_PRIVATE DEAL_ST DEAL_S_A DEAL_S_B DEAL_S_C",
      },
      deal_logo: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      deal_background: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      min_interest: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      max_interest: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      deal_summary: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      deal_desc: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      deal_status: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "RAISING",
        comment: "comm_code = deal_status RAISING - ADMIN - CLOSED",
      },
      total_interest: {
        type: DataTypes.FLOAT(53),
        allowNull: true,
      },
      final_cap: {
        type: DataTypes.FLOAT(53),
        allowNull: true,
      },
      total_cur_paid: {
        type: DataTypes.FLOAT(53),
        allowNull: true,
      },
      payment_due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "end_date = deadline date",
      },
      create_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      update_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "DEAL_INFO",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "deal_id" }],
        },
        {
          name: "deal_info_pjt_id_foreign",
          using: "BTREE",
          fields: [{ name: "pjt_id" }],
        },
      ],
    }
  );
};
