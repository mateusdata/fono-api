const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

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
    alternative_names: {
        type: DataTypes.ARRAY(DataTypes.STRING(60)),
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    objective: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM,
        defaultValue: 'active',
        values: ['active', 'banned', 'inactive']
    },
    video_urls: {
        type: DataTypes.ARRAY(DataTypes.STRING(150)),
        allowNull: true
    },
    academic_sources: {
        type: DataTypes.ARRAY(DataTypes.STRING(150)),
        allowNull: false,
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
    modelName: 'exercise',
    tableName: 'exercise',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes:[
        {
            name: 'exercise_objective_name_description_idx',
            fields:['name', 'description', 'objective'],
            type: 'FULLTEXT'
        }
    ]
});

module.exports = Exercise;