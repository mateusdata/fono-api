const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Exercise = require('./Exercise');

class ExercisePlan extends Model { }

ExercisePlan.init({
    exp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    exe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Exercise',
            key: 'exe_id'
        }
    },
    repetitions: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    series: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    modelName: 'exercise_plan',
    tableName: 'exercise_plan',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

ExercisePlan.hasOne(Exercise, { sourceKey: 'exe_id', foreignKey: 'exe_id' });
Exercise.belongsToMany(ExercisePlan, { through: ExercisePlan, foreignKey: 'exe_id', otherKey: 'exe_id' });

module.exports = ExercisePlan;