const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

class Person extends Model { }

Person.init({
  per_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  use_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      modelName: User,
      key: 'use_id'
    }
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
  indexes: [
    {
      name: 'person_first_name_last_name_cpf_idx',
      fields: ['first_name', 'last_name', 'cpf']
    }
  ]
});

User.hasOne(Person, { foreignKey: 'use_id', sourceKey: 'use_id' });
Person.belongsTo(User, { foreignKey: 'use_id', targetKey: 'use_id' })

module.exports = Person;