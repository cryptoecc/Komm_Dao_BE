const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const KommitteeInfo = sequelize.define(
    "KOMMITTEE_INFO",
    {
      komm_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      komm_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "USER_INFO",
          key: "user_id",
        },
      },
      komm_ver: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      komm_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      create_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      update_date: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "KOMMITTEE_INFO",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "komm_id" }],
        },
        {
          name: "kommittee_info_user_id_foreign",
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );

  KommitteeInfo.associate = function (models) {
    KommitteeInfo.belongsTo(models.USER_INFO, {
      foreignKey: "user_id",
      as: "user",
    });
  };

  return KommitteeInfo;
};
