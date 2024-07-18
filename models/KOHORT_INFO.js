const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('KOHORT_INFO', {
    kohort_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'KOHORT_MEMBERS',
        key: 'kohort_id'
      }
    },
    kohort_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    leader_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'USER_INFO',
        key: 'user_id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    kohort_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'KOHORT_INFO',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "kohort_id" },
        ]
      },
      {
        name: "kohort_info_leader_user_id_foreign",
        using: "BTREE",
        fields: [
          { name: "leader_user_id" },
        ]
      },
    ]
  });
};
