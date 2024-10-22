const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserInfo = sequelize.define(
    "USER_INFO",
    {
      user_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email_addr: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      wallet_addr: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      expertise: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment:
          "COMM_CODE = USER_EXPERTISE USER_INV USER_RES USER_DEV USER_MAR USER_DES USER_LAW USER_HH",
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      value_add: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reg_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      appr_status: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cur_xp: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      last_login_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nft_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      user_image_link: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      voting_power: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "update vote power",
      },
      applied_date: {
        type: DataTypes.DATE,
        allowNull: true,
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
      tableName: "USER_INFO",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "user_id" }],
        },
      ],
    }
  );

  UserInfo.associate = function (models) {
    UserInfo.hasMany(models.KOMMITTEE_INFO, {
      foreignKey: "user_id",
      as: "kommittees",
    });

    UserInfo.hasMany(models.KOHORT_INFO, {
      foreignKey: "leader_user_id",
      as: "ledKohorts",
    });

    UserInfo.belongsToMany(models.KOHORT_INFO, {
      through: models.KOHORT_MEMBERS,
      foreignKey: "user_id",
      otherKey: "kohort_id",
      as: "kohorts",
    });

    UserInfo.hasOne(models.ADMIN_USER, {
      foreignKey: "user_id",
      as: "admin",
    });

    UserInfo.hasMany(models.USER_DEAL_INTEREST, {
      foreignKey: "user_id",
      as: "dealInterests",
    });

    UserInfo.hasMany(models.USER_INVITE_CONTRIBUTION, {
      foreignKey: "user_id",
      as: "sentInvites", // 초대장을 보낸 유저의 정보를 나타내는 관계
    });
  };

  // // 관계 설정
  // UserInfo.associate = function (models) {
  //   UserInfo.hasMany(models.USER_DEAL_INTEREST, {
  //     foreignKey: "user_id",
  //     as: "dealInterests",
  //   });
  // };

  return UserInfo;
};
