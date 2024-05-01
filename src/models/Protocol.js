const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Doctor = require('./Doctor');
const Session = require('./Session');

class Protocol extends Model { }

Protocol.init({
    pro_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ses_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Session,
            key: 'ses_id'
        }
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
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


Session.hasOne(Protocol, { foreignKey: 'ses_id' });
Protocol.belongsTo(Session, { foreignKey: 'ses_id' });

module.exports = Protocol;