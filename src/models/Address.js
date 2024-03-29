const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Person = require('./Person');

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
    }
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

module.exports = Pacient;