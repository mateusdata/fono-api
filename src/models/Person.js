const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");
const User = require('./User');
const PersonHasUser = require('./PersonHasUser');

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

User.belongsToMany(Person, {through: PersonHasUser, foreignKey: 'use_id', otherKey: 'per_id' });
Person.belongsToMany(User, {through: PersonHasUser, foreignKey: 'per_id', otherKey: 'use_id' });

module.exports =  Person;