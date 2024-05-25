const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Person = require('./Person');
const Doctor = require('./Doctor');

class Pacient extends Model { }

Pacient.init({
  pac_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  per_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Person,
      key: 'per_id'
    },
    allowNull: false
  },
  doc_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Doctor,
      key: 'doc_id',
    },
    allowNull: false
  },
  full_name: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.first_name} ${this.last_name}`;
    },
    set(value) {
      throw new Error('Do not try to set the `fullName` value!');
    },
  },
  first_name: {
    type: DataTypes.TEXT(60),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.TEXT(60),
    allowNull: true,
  },
  base_diseases:{
    type: DataTypes.TEXT(300),
    allowNull: true,
  },
  consultation_reason:{
    type: DataTypes.TEXT(300),
    allowNull: true,
  },
  food_profile:{
    type: DataTypes.TEXT(300),
    allowNull: true,
  },
  chewing_complaint:{
    type: DataTypes.TEXT(300),
    allowNull: true,
  },
  education:{
    type: DataTypes.TEXT(300),
    allowNull: true,
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

Pacient.Person = Pacient.belongsTo(Person, { foreignKey: 'per_id', targetKey: 'per_id' });
Person.Pacient = Person.hasOne(Pacient, { foreignKey: 'per_id', sourceKey: 'per_id' });


Doctor.hasMany(Pacient, { foreignKey: 'doc_id', sourceKey: 'doc_id' });
Pacient.belongsTo(Doctor, { foreignKey: 'doc_id', targetKey: 'doc_id' });

module.exports = Pacient;