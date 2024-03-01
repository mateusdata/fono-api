const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');
const Plan = require('./Plan');

class UserHasPlan extends Model { }

UserHasPlan.init({
    usp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    use_id: {
        type: DataTypes.INTEGER,
        references:{
            model: User,
            key: 'use_id'
        }
    },
    pla_id: {
        type: DataTypes.INTEGER,
        references:{
            model: Plan,
            key: 'pla_id'
        }
    },
   
}, {
    sequelize,
    modelName: 'user_has_plan',
    tableName: 'user_has_plan',
    timestamps: false,
});

module.exports = UserHasPlan;