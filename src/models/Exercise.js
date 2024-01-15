const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");

class Exercise extends Model { }

Exercise.init({
    exe_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
        type: DataTypes.STRING(10),
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'banned', 'inactive']]
        }
    },
    video_urls: {
        type: DataTypes.ARRAY(DataTypes.CHAR),
        allowNull: true
    },
    academic_sources:{
        type: DataTypes.ARRAY(DataTypes.CHAR),
        allowNull: false,
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
    modelName: 'Exercise',
    tableName: 'exercise',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Exercise;