const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

class Plan extends Model { }

Plan.init({
    pla_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM,
        defaultValue: 'active',
        values: ['active', 'banned', 'inactive']
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    taxes: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    currency: {
        type: DataTypes.ENUM("BRL", "USD"),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    valid_until: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'plan',
    tableName: 'plan',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});

module.exports = Plan;