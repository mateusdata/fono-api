const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')

class Pacient extends Model {}

Pacient.init({
  pac_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM,
    defaultValue: 'active',
    values: ['active', 'banned', 'inactive']
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
  modelName: 'pacient',
  tableName: 'pacient',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports =  Pacient;