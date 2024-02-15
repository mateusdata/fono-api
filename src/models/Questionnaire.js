const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Questionnaire extends Model { }

Questionnaire.init({
    qus_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'questionnaire',
    modelName: 'questionnaire',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


module.exports = Questionnaire;