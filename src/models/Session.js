const { Model, DataTypes, NOW } = require('sequelize');
const sequelize = require("../config/sequelize");
const Pacient = require('./Pacient');

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
        allowNull: true,
        references: {
            model: Pacient,
            key: 'pac_id'
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

module.exports = Session;
