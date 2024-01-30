const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/sequelize');
const Person = require('./Person');
const User = require('./User');

class PersonHasUser extends Model { }

PersonHasUser.init({
    use_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'use_id',
        }
    },
    per_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Person,
            key: 'per_id',
        }
    }
}, {
    sequelize,
    modelName: 'person_has_user',
    tableName: 'person_has_user',
    timestamps: false,
});

User.belongsToMany(Person, { through: PersonHasUser, foreignKey: 'use_id', otherKey: 'per_id' });
Person.belongsToMany(User, { through: PersonHasUser, foreignKey: 'per_id', otherKey: 'use_id' });

module.exports = PersonHasUser;