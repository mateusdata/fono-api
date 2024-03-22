const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const Costumer = require('./Costumer');

class Subscription extends Model { }

Subscription.init({
    sub_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    costumer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Costumer,
            key: 'costumer_id',
        },
        allowNull: false
    },
    subscription_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    subscription_status: {
        type: DataTypes.STRING,
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
    modelName: 'subscription',
    tableName: 'subscription',
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
});

Costumer.Subscription = Costumer.hasOne(Subscription, { foreignKey: 'costumer_id', sourceKey: "costumer_id"});
Subscription.belongsTo(Costumer, { foreignKey: 'costumer_id', targetKey: 'costumer_id'});

module.exports = Subscription;