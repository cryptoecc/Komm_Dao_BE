const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "CONTRACTS",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: false,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      deployer: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      owner: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      network_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      network_url: {
        type: DataTypes.STRING(355),
        allowNull: false,
      },
      active: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "CONTRACTS",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
};
