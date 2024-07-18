const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('WATCHLIST_INFO', {
    watch_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "user_id_unique"
    },
    pjt_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PROJECT_INFO',
        key: 'pjt_id'
      }
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'WATCHLIST_INFO',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "watch_id" },
        ]
      },
      {
        name: "user_id_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "watchlist_info_pjt_id_foreign",
        using: "BTREE",
        fields: [
          { name: "pjt_id" },
        ]
      },
    ]
  });
};
