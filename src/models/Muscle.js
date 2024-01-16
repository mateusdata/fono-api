const { Model, DataTypes } = require('sequelize');
const sequelize = require("../config/sequelize");

const Exercise = require('./Exercise');
const MuscleHasExercise = require('./MuscleHasExercise');

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
        type: DataTypes.STRING(10),
        defaultValue: 'active',
        validate: {
            isIn: [['active', 'banned', 'inactive']]
        }
    },
    image_urls: {
        type: DataTypes.ARRAY(DataTypes.STRING(150)),
        allowNull: true
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
    modelName: 'Muscle',
    tableName: 'muscle',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

Muscle.belongsToMany(Exercise, {through: MuscleHasExercise, foreignKey: 'mus_id', otherKey: 'exe_id' });
Exercise.belongsToMany(Muscle, {through: MuscleHasExercise, foreignKey: 'exe_id', otherKey: 'mus_id' });

module.exports = Muscle;