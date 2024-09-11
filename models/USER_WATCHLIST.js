module.exports = (sequelize, DataTypes) => {
  const USER_WATCHLIST = sequelize.define(
    "USER_WATCHLIST",
    {
      watch_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pjt_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      create_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      update_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["user_id", "pjt_id"],
        },
      ],
    }
  );

  USER_WATCHLIST.associate = function (models) {
    USER_WATCHLIST.belongsTo(models.PROJECT_INFO, {
      foreignKey: "pjt_id",
      as: "project",
    });
  };

  return USER_WATCHLIST;
};

// 변경사항
// 데이터 타입 변경:

// 수정 전: create_date와 update_date가 DataTypes.DATEONLY로 정의됨.
// 수정 후: create_date와 update_date가 DataTypes.DATE로 변경됨.
// 이유: DATEONLY는 날짜만 저장할 수 있으며 시간 정보를 포함하지 않지만, DATE는 날짜와 시간 모두 저장할 수 있습니다. DATE를 사용하면 타임스탬프 정보를 포함할 수 있어 더 많은 정보를 제공할 수 있습니다.
// 기본값 설정:

// 수정 전: create_date와 update_date에 기본값 설정 없음.
// 수정 후: create_date와 update_date의 기본값을 DataTypes.NOW로 설정하여 현재 시간으로 자동으로 설정됩니다.
// 이유: 기본값을 설정하면 데이터가 생성될 때 자동으로 현재 시간으로 설정되어, 별도로 값을 입력하지 않아도 되며 데이터의 일관성을 유지할 수 있습니다.
// allowNull 속성:

// 수정 전: create_date와 update_date가 allowNull: false로 설정되어 있지 않음.
// 수정 후: create_date와 update_date가 allowNull: false로 설정됨.
// 이유: 날짜 필드가 항상 필요하기 때문에 null을 허용하지 않도록 설정하여 데이터의 완전성을 보장합니다.
// 인덱스와 제약 조건:

// 수정 전: user_id에 대한 유일 인덱스는 unique: "user_id_unique"로 설정됨.
// 수정 후: user_id와 pjt_id 조합에 대해 유일 인덱스를 설정함.
// 이유: user_id와 pjt_id의 조합이 유일해야 하는 경우, 두 필드를 함께 유일하게 설정하여 중복 데이터를 방지합니다.
// 관계 설정:

// 수정 전: belongsTo 설정이 없음.
// 수정 후: USER_WATCHLIST가 PROJECT_INFO 모델과 belongsTo 관계를 설정함.
// 이유: 관계를 명시적으로 설정하면 모델 간의 관계를 정의하고, 데이터베이스 조인 및 연관된 데이터를 쉽게 조회할 수 있습니다.
// 요약
// 데이터 타입 및 기본값: DATE와 DataTypes.NOW 사용으로 날짜와 시간 정보를 포함하도록 개선함.
// allowNull 설정: 필수 필드로 설정하여 데이터 완전성 보장.
// 인덱스 및 제약 조건: user_id와 pjt_id 조합에 대한 유일 인덱스 추가하여 중복 방지.
// 관계 설정: 명시적인 관계 설정으로 모델 간의 연관 데이터 접근 가능.
