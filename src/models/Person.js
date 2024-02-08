const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Person extends Model { }

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
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true
  },
  birthday: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'person',
  tableName: 'person',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes:[
    {
      name: 'person_first_name_last_name_cpf_idx',
      fields:['first_name', 'last_name', 'cpf']
    }
  ]
});


module.exports = Person;