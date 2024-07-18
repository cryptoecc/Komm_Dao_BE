const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('COMMON', {
    comm_id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    comm_type: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    comm_code: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    comm_name: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    create_date: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    update_date: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'COMMON',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "comm_id" },
        ]
      },
    ]
  });
};
