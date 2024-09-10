const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const KohortInfo = sequelize.define(
    "KOHORT_INFO",
    {
      kohort_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // 외래 키로 참조하지 않음
      },
      kohort_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      leader_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "USER_INFO",
          key: "user_id",
        },
      },
      description: {
        type: DataTypes.TEXT,
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
      profile_image_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      banner_image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "URL for the banner image of the kohort",
      },
      contribution: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Contribution category for the kohort",
      },
      committee: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Committee associated with the kohort",
      },
      max_participants: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Maximum number of participants in the kohort",
      },
      telegram_username: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Telegram username for the kohort leader",
      },
      team_group_chat_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Link to the team group chat",
      },
      approval_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: "Date when the kohort was approved",
      },
      appr_status: {
        type: DataTypes.ENUM("PENDING", "APPLIED", "DENIED", "DELETED"),
        allowNull: true,
        defaultValue: "PENDING",
        comment: "Status of the Kohort (PENDING, APPLIED, DENIED, DELETED)",
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
      tableName: "KOHORT_INFO",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "kohort_id" }],
        },
        {
          name: "kohort_info_leader_user_id_foreign",
          using: "BTREE",
          fields: [{ name: "leader_user_id" }],
        },
      ],
    }
  );

  KohortInfo.associate = function (models) {
    KohortInfo.belongsTo(models.USER_INFO, {
      foreignKey: "leader_user_id",
      as: "leader",
    });

    KohortInfo.belongsToMany(models.USER_INFO, {
      through: models.KOHORT_MEMBERS,
      foreignKey: "kohort_id",
      otherKey: "user_id",
      as: "members",
    });
  };

  return KohortInfo;
};
