const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Section = require('./Section');

class Question extends Model { }

Question.init({
    que_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    qhs_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Section,
            key: 'qhs_id'
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

Section.Question = Section.hasMany(Question, { foreignKey: 'qhs_id' });
Question.belongsTo(Section, { foreignKey: 'qhs_id'});

module.exports = Question;