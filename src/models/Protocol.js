const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Doctor = require('./Doctor');

class Protocol extends Model { }

Protocol.init({
    pro_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    doc_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Doctor,
            key: 'doc_id'
        }
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['layout', 'prescription'],
        defaultValue: 'layout',
    },
    description: {
        type: DataTypes.TEXT,
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
    modelName: 'protocol',
    tableName: 'protocol',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = Protocol;