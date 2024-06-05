const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Person = require('./Person');


class Phone extends Model { }

Phone.init({
  pho_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  per_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      modelName: Person,
      key: 'per_id'
    }
  },
  ddi: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '55'
  },
  ddd: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    defaultValue: 'active',
    values: ['active', 'banned', 'inactive']
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'phone_number',
  tableName: 'phone_number',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

module.exports = Phone;