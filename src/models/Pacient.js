const { Model, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = require("../config/sequelize")

class Pacient extends Model {}

Pacient.init({
  pac_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  paranoid: true,
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'banned', 'inactive']]
    }
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Pacient',
  tableName: 'pacient',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports =  Pacient;