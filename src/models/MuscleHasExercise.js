const { Model, DataTypes } = require('sequelize');
const Muscle = require('./Muscle');
const Exercise = require('./Exercise');
const sequelize = require('../config/sequelize');

class MuscleHasExercise extends Model { }

MuscleHasExercise.init({
    exe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Exercise,
            key: 'exe_id',
        }
    },
    mus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Muscle,
            key: 'mus_id',
        }
    },
    effectiveness: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'muscle_has_exercise',
    tableName: 'muscle_has_exercise',
    timestamps: false,
});



module.exports = MuscleHasExercise;