const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const User = require("./User");
const Card = require("./Card");
class Costumer extends Model { }

Costumer.init({
    cos_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    use_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'use_id',
        },
        allowNull: false
    },
    costumer_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    invoice_prefix: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    default_payment_method: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'costumer',
    tableName: 'costumer',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

Costumer.Card = Costumer.hasOne(Card, { foreignKey: 'costumer_id', sourceKey: "costumer_id" });
Card.belongsTo(Costumer, { foreignKey: 'costumer_id', targetKey: 'costumer_id' });

User.hasOne(Costumer, { foreignKey: 'use_id', sourceKey: 'use_id' });
Costumer.belongsTo(User, { foreignKey: 'use_id', targetKey: 'use_id' });

module.exports = Costumer;