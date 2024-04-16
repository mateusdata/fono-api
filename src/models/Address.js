const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Person = require('./Person');

class Address extends Model { }

Address.init({
  add_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  per_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: 'per_id'
    }
  },
  city: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  line1 :{
    type: DataTypes.STRING(150),
    allowNull: false
  },
  line2 :{
    type: DataTypes.STRING(150),
    allowNull: false
  },
  zip_code :{
    type: DataTypes.STRING(8),
    allowNull: false
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
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'address',
  tableName: 'address',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});


module.exports = Address;