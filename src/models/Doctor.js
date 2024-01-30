const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Doctor extends Model {}

Doctor.init({
  doc_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  gov_license:{
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: ['active', 'banned', 'inactive']
    }
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
  modelName: 'doctor',
  tableName: 'doctor',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports =  Doctor;