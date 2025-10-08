const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Activity', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userName:{
      type: DataTypes.STRING,
      allowNull: false
    },
    userEmail:{
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[1, 2, 3]] // Only allow 1, 2, or 3
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'Activities',
    timestamps: true,
    paranoid: true 
  });
};