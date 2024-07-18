const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CONTRIBUTION_INFO', {
    cont_id: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      primaryKey: true
    },
    pjt_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PROJECT_INFO',
        key: 'pjt_id'
      }
    },
    pjt_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cont_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "COMM_CODE = CONT_TYPE CON_COM_ENA CON_NOD_VAL CON_RES CON_MAR"
    },
    cont_summary: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cont_desc: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    cont_reward: {
      type: DataTypes.DOUBLE,
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
    cont_xp: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    cont_status: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ms_1_id: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      references: {
        model: 'USER_CONTRIBUTION',
        key: 'ms_1_id'
      }
    },
    ms_1_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ms_1_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ms_2_id: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      references: {
        model: 'USER_CONTRIBUTION',
        key: 'ms_2_id'
      }
    },
    ms_2_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ms_2_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ms_3_id: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      references: {
        model: 'USER_CONTRIBUTION',
        key: 'ms_3_id'
      }
    },
    ms_3_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ms_3_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'CONTRIBUTION_INFO',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "cont_id" },
        ]
      },
      {
        name: "contribution_info_ms_2_id_foreign",
        using: "BTREE",
        fields: [
          { name: "ms_2_id" },
        ]
      },
      {
        name: "contribution_info_pjt_id_foreign",
        using: "BTREE",
        fields: [
          { name: "pjt_id" },
        ]
      },
      {
        name: "contribution_info_ms_1_id_foreign",
        using: "BTREE",
        fields: [
          { name: "ms_1_id" },
        ]
      },
      {
        name: "contribution_info_ms_3_id_foreign",
        using: "BTREE",
        fields: [
          { name: "ms_3_id" },
        ]
      },
    ]
  });
};
