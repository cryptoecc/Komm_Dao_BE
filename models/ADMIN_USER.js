const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AdminUser = sequelize.define(
    "ADMIN_USER",
    {
      admin_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        // USER_INFO의 user_id를 참조하는 외래 키
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "USER_INFO", // 참조할 테이블 이름
          key: "user_id", // 참조할 칼럼
        },
        onDelete: "CASCADE", // 사용자 삭제 시 ADMIN_USER 레코드도 삭제
        onUpdate: "CASCADE", // USER_INFO의 user_id가 업데이트되면 ADMIN_USER의 user_id도 업데이트
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "ADMIN_USER",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "admin_id" }],
        },
      ],
    }
  );
  AdminUser.associate = function (models) {
    AdminUser.belongsTo(models.USER_INFO, {
      foreignKey: "user_id",
      as: "user", // 관계의 별칭
    });
  };

  return AdminUser;
};
