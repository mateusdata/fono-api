const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Questionnaire = require('./Questionnaire');

class Section extends Model { }

Section.init({
    qhs_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    qus_id: {
        type: DataTypes.INTEGER,
      references:{
        model: Questionnaire,
        key:'qus_id'
      }
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
}, {
    sequelize,
    tableName: 'questionnaire_has_section',
    modelName: 'section',
    timestamps: false,
});

Questionnaire.Section = Questionnaire.hasMany(Section, { foreignKey: 'qus_id' });
Section.belongsTo(Questionnaire, { foreignKey: 'qus_id'});

module.exports = Section;