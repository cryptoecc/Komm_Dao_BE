const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const ContributionMission = sequelize.define(
    "CONTRIBUTION_MISSIONS",
    {
      ms_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      cont_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "CONTRIBUTION_INFO", // 외래 키 참조
          key: "cont_id",
        },
      },
      ms_type: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ms_yn: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "CONTRIBUTION_MISSIONS",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          fields: ["ms_id", "cont_id"], // 복합 키 설정 (필요 시)
        },
      ],
    }
  );

  ContributionMission.associate = function (models) {
    // USER_INVITE_CONTRIBUTION 모델과의 관계 설정
    ContributionMission.hasMany(models.USER_INVITE_CONTRIBUTION, {
      foreignKey: "ms_id",
      as: "invitesByMission",
    });

    ContributionMission.hasMany(models.USER_INVITE_CONTRIBUTION, {
      foreignKey: "cont_id",
      as: "invitesByContribution",
    });
  };

  return ContributionMission;
};
