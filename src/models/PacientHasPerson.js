const { Model, DataTypes } = require('sequelize');

const sequelize = require("../config/sequelize")

class PacientHasPerson extends Model {}

PacientHasPerson.init({
    pac_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'pacient',
            key: 'pac_id',
        }
    },
    per_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'person',
            key: 'per_id',
        }
    }
}, {
  sequelize,
  modelName: 'PacientHasPerson',
  tableName: 'pacient_has_person',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports =  PacientHasPerson;