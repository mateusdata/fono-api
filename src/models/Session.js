const { Model, DataTypes, NOW } = require('sequelize');
const sequelize = require("../config/sequelize");
const Pacient = require('./Pacient');
const Doctor = require('./Doctor');

class Session extends Model { }

Session.init({
    ses_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    pac_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pacient,
            key: 'pac_id'
        }
    },
    doc_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Doctor,
            key: 'doc_id'
        }
    },
    begin: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: NOW
    },
    end: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    duration: {
        type: DataTypes.TIME,
        allowNull: true
    },
    comments: {
        type: DataTypes.TEXT,
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
}, {
    sequelize,
    modelName: 'session',
    tableName: 'session',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Pacient.hasMany(Session, { foreignKey: 'pac_id', sourceKey: 'pac_id' });
Session.belongsTo(Pacient, { foreignKey: 'pac_id', targetKey: 'pac_id' });

Doctor.hasMany(Session, { foreignKey: 'doc_id', sourceKey: 'doc_id' });
Session.belongsTo(Doctor, { foreignKey: 'doc_id', targetKey: 'doc_id' });

module.exports = Session;
