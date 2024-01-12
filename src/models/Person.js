const { Model, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = require("../config/sequelize")

class Person extends Model {}

Person.init({
  per_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  middle_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique:true
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
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
  modelName: 'Person',
  tableName: 'person',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports =  Person;