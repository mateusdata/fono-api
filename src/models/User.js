const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class User extends Model { }

User.init({
  use_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nick_name:{
    type: DataTypes.CHAR(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.CHAR(150),
    allowNull: false,
  },
  password: {
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
  roles: {
    type: DataTypes.ARRAY(DataTypes.CHAR(150)),
    allowNull: false
  },
  recover_password: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verification_code: {
    type: DataTypes.CHAR(6),
    allowNull: true
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM,
    defaultValue: 'active',
    values: ['active', 'banned', 'inactive']
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
  modelName: 'user',
  tableName: 'user',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;