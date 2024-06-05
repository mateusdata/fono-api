const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');
//const DoctorHasPacient = require('./DoctorHasPacient');

class Doctor extends Model { }

Doctor.init({
  doc_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  use_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'use_id'
    }
  },
  gov_license: {
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
  modelName: 'doctors',
  tableName: 'doctors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Doctor.User = Doctor.belongsTo(User, { foreignKey: 'use_id', targetKey: 'use_id' });
User.Doctor = User.hasOne(Doctor, { foreignKey: 'use_id', sourceKey: 'use_id' });


module.exports = Doctor;