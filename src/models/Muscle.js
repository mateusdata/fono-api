const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

class Muscle extends Model { }

Muscle.init({
    mus_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    latin_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM,
        defaultValue: 'active',
        values: ['active', 'banned', 'inactive']
    },
    image_urls: {
        type: DataTypes.ARRAY(DataTypes.STRING(150)),
        allowNull: true
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
    modelName: 'muscle',
    tableName: 'muscle',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


module.exports = Muscle;