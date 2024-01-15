const { Model, DataTypes } = require('sequelize');

const sequelize = require("../config/sequelize")

class MuscleHasExercise extends Model {}

MuscleHasExercise.init({
    exe_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'exercise',
            key: 'exe_id',
        }
    },
    mus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'muscle',
            key: 'mus_id',
        }
    },
    effectiveness: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
  sequelize,
  modelName: 'MuscleHasExercise',
  tableName: 'muscle_has_exercise',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports =  MuscleHasExercise;