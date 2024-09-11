const { Sequelize, DataTypes } = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const ProjectInfo = sequelize.define(
    "PROJECT_INFO",
    {
      create_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW, // 현재 날짜를 기본값으로 설정
      },
      pjt_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      pjt_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      x_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "", // 기본값을 빈 문자열로 설정
      },
      x_followers: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0, // 기본값을 0으로 설정
      },
      discord_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "", // 기본값을 빈 문자열로 설정
      },
      discord_members: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0, // 기본값을 0으로 설정
      },
      linkedIn_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "", // 기본값을 빈 문자열로 설정
      },
      github_link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "", // 기본값을 빈 문자열로 설정
      },
      github_stars: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0, // 기본값을 0으로 설정
      },
      github_wkly_comm: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "", // 기본값을 빈 문자열로 설정
      },
      raising_amount: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "", // 기본값을 빈 문자열로 설정
      },
      valuation: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "", // 기본값을 빈 문자열로 설정
      },
      investors: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "", // 기본값을 빈 문자열로 설정
      },
      pjt_grade: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "0",
      },
      pjt_summary: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      pjt_details: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      adm_trend: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      adm_expertise: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      adm_final_grade: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      update_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      update_yn: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      apply_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      apply_yn: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: "N",
      },
      total_rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_per: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "PROJECT_INFO",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "pjt_id" }],
        },
      ],
    }
  );

  // 테이블 동기화 후 AUTO_INCREMENT를 1로 리셋하는 후크 추가
  ProjectInfo.afterSync(async () => {
    await sequelize.query("ALTER TABLE PROJECT_INFO AUTO_INCREMENT = 1");
  });

  // 관계 설정
  ProjectInfo.associate = (models) => {
    ProjectInfo.hasMany(models.USER_WATCHLIST, {
      foreignKey: "pjt_id",
      as: "watchlistEntries",
    });
  };

  return ProjectInfo;
};

// ProjectInfo.hasMany(models.USER_WATCHLIST, { ... })는 ProjectInfo 모델과 USER_WATCHLIST 모델 간의 일대다 관계를 설정합니다.
// foreignKey: "pjt_id"는 USER_WATCHLIST 테이블에서 ProjectInfo의 기본 키와 연결될 외래 키를 지정합니다.
// as: "watchlistEntries"는 이 관계의 별칭을 지정하여 데이터 조회 시 편리하게 사용할 수 있도록 합니다.
