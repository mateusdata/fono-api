const { Model, DataTypes } = require('sequelize');

const sequelize = require("../config/sequelize")

class PersonHasUser extends Model { }

PersonHasUser.init({
    use_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'use_id',
        }
    },
    per_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'person',
            key: 'per_id',
        }
    }
}, {
    sequelize,
    modelName: 'PersonHasUser',
    tableName: 'person_has_user',
    timestamps: false,
});

module.exports = PersonHasUser;