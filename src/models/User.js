const { Model, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = require("../config/sequelize")

class User extends Model {}

User.init({
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  per_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'person', // Cqui é o nome do modelo de pessoas
      key: 'per_id', // Chave estrageira
      
    },
    onDelete:'cascate'
  },
  email: {
    type: DataTypes.CHAR(50),
    allowNull: false,
  },
  password: {
    type: DataTypes.CHAR(255),
    allowNull: false,
  },
  reset_password: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verification_code: {
    type: DataTypes.CHAR(6),
    defaultValue: false,
  },
  expiration_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING(10),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'banned', 'inactive']]
    }
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
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports =  User;
