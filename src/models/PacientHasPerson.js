const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/sequelize');
const Person = require('./Person');
const Pacient = require('./Pacient');

class PacientHasPerson extends Model {}

PacientHasPerson.init({
    pac_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pacient,
            key: 'pac_id',
        }
    },
    per_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Person,
            key: 'per_id',
        }
    }
}, {
  sequelize,
  modelName: 'pacient_has_person',
  tableName: 'pacient_has_person',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports =  PacientHasPerson;