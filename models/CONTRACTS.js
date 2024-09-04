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
        unique: false, // GOvernance (delegate, proposal ), Membership 
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false, // contract address 
      },
      deployer: {
        type: DataTypes.STRING(255),
        allowNull: false, // 처음 컨트랙트를 배포한 사람
      },
      owner: {
        type: DataTypes.STRING(255),
        allowNull: false, // owner => admin
      },
      network_name: {
        type: DataTypes.STRING(255),
        allowNull: false, // Optimism
      },
      network_url: {
        type: DataTypes.STRING(355),
        allowNull: false, // Optimism url
      },
      active: {
        type: DataTypes.INTEGER,
        allowNull: false, // Running, Stop 
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
