const { Model, DataTypes } = require('sequelize');
const Pacient = require('./Pacient');
const Doctor = require('./Doctor');
const sequelize = require('../config/sequelize');

class DoctorHasPacient extends Model { }

DoctorHasPacient.init({
  dhp_id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  doc_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Doctor,
      key: 'doc_id',
    },
    allowNull: false
  },
  pac_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Pacient,
      key: 'pac_id'
    },
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'doctor_has_pacient',
  tableName: 'doctor_has_pacient',
  timestamps: false,
});

module.exports = DoctorHasPacient;