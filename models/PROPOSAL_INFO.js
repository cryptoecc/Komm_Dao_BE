const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PROPOSAL_INFO', {
    prop_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'USER_PROPOSAL',
        key: 'prop_id'
      }
    },
    prop_title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prop_desc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    voting_strategy: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    prop_status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "PENDING",
      comment: "pending, ongoing, queued, executed"
    },
    create_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'USER_INFO',
        key: 'user_id'
      }
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "start_date = create_date + 2"
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "end_date = start_date + 4"
    },
    executed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "executed_date = end_date + 1"
    }
  }, {
    sequelize,
    tableName: 'PROPOSAL_INFO',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "prop_id" },
        ]
      },
      {
        name: "proposal_info_create_user_id_foreign",
        using: "BTREE",
        fields: [
          { name: "create_user_id" },
        ]
      },
    ]
  });
};
