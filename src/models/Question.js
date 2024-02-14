const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Questionnaire = require('./Questionnaire');

class Question extends Model { }

Question.init({
    que_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    qus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Questionnaire,
            key: 'qus_id'
        }
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    alternatives: {
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
    modelName: 'question',
    tableName: 'question',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Questionnaire.Question = Questionnaire.hasMany(Question, { foreignKey: 'qus_id' });
Question.belongsTo(Questionnaire, { foreignKey: 'qus_id'});

module.exports = Question;