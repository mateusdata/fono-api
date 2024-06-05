const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const bcrypt = require('bcrypt');

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
  modelName: 'users',
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    // Hook executed before saving the user
    beforeCreate: async (user) => {
      if (user.changed('password')) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
      }
    },
  },
});


module.exports = User;