const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Protocol = require('./Protocol');
const ExercisePlan = require('./ExercisePlan');


class ProtocolHasExercisePlan extends Model { }

ProtocolHasExercisePlan.init({
    phe_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Protocol,
            key: 'pro_id'
        }
    },
    exp_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ExercisePlan,
            key: 'exp_id'
        }
    }
}, {
    sequelize,
    modelName: 'protocol_has_exercise_plan',
    tableName: 'protocol_has_exercise_plan',
    timestamps: false,
});

Protocol.belongsToMany(ExercisePlan, { through: ProtocolHasExercisePlan, foreignKey: 'pro_id', otherKey: 'exp_id'});
ExercisePlan.belongsToMany(Protocol, { through: ProtocolHasExercisePlan, foreignKey: 'exp_id', otherKey: 'pro_id'});