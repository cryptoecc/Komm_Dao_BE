const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const UserRating = sequelize.define(
    "USER_RATING",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pjt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
      },
      rating_yn: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      rating_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "USER_RATING",
      timestamps: false,
      indexes: [
        {
          name: "idx_pjt_user_unique", // pjt_id와 user_id의 복합 유니크 제약
          unique: true,
          using: "BTREE",
          fields: [{ name: "pjt_id" }, { name: "user_id" }],
        },
        {
          name: "idx_user_id", // user_id에 대한 추가 인덱스
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );

  // UserRating이 UserInfo와의 관계 설정
  UserRating.associate = function (models) {
    UserRating.belongsTo(models.UserInfo, {
      foreignKey: "user_id",
      as: "UserInfo",
    });
  };

  // 특정 프로젝트의 평균 별점 계산
  UserRating.calculateAverageRating = async function (projectId) {
    const result = await sequelize.query(
      `SELECT AVG(rating) as averageRating
       FROM USER_RATING
       WHERE pjt_id = :projectId AND rating_yn = 'Y'`,
      {
        replacements: { projectId },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return result[0].averageRating || 0;
  };

  // 전체 프로젝트 평균 평점 가져오기
  UserRating.getAllProjectRatings = async function () {
    const result = await sequelize.query(
      `SELECT pjt_id, AVG(rating) as averageRating
       FROM USER_RATING
       WHERE rating_yn = 'Y'
       GROUP BY pjt_id`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return result;
  };

  return UserRating;
};
