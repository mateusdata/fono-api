const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const Pacient = require("./Pacient");
const Question = require("./Question");


class QuestionAnswered extends Model { }


QuestionAnswered.init({
    qua_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    pac_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Pacient,
            key: 'pac_id'
        }
    },
    que_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Question,
            key: 'que_id'
        }
    }
}, {
    sequelize,
    modelName: 'question_answered',
    tableName: 'question_answered',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

QuestionAnswered.belongsTo(Pacient, { foreignKey: 'pac_id' });
QuestionAnswered.belongsTo(Question, { foreignKey: 'que_id' });

module.exports = QuestionAnswered;