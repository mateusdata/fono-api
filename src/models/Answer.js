const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const Pacient = require("./Pacient");
const Question = require("./Question");


class Answer extends Model { }


Answer.init({
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
    },
    alternative: {
        type: DataTypes.STRING(150),
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
    modelName: 'answer',
    tableName: 'question_answered',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


Answer.belongsTo(Pacient, { foreignKey: 'pac_id' });
Pacient.hasMany(Answer, { foreignKey: 'pac_id' });

Answer.belongsTo(Question, { foreignKey: 'que_id' });
Question.hasOne(Answer, { foreignKey: 'que_id' });


module.exports = Answer;