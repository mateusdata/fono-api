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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: '2023-10-02',
    allowNull: false,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: '2023-10-02',
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'doctor_has_pacient',
  tableName: 'doctor_has_pacient',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Pacient.belongsToMany(Doctor, { through: DoctorHasPacient, foreignKey: 'pac_id', otherKey: 'doc_id' });
Doctor.belongsToMany(Pacient, { through: DoctorHasPacient, foreignKey: 'doc_id', otherKey: 'pac_id' });

module.exports = DoctorHasPacient;