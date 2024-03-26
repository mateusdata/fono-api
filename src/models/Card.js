const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelize");
const Costumer = require("./Costumer");

class Card extends Model { }


Card.init({
    car_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    card_id:{
        type: DataTypes.STRING,
        allowNull: false
    },
    costumer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Costumer,
            key: 'costumer_id',
        },
        allowNull: false
    },
    holder_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    exp_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    exp_month: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    brand:{
        type: DataTypes.STRING,
        allowNull: false
    },
    country:{
        type: DataTypes.STRING(3),
        allowNull: false
    },
    last4:{
        type: DataTypes.STRING(4),
        allowNull: false
    },
    cvc_check:{
        type: DataTypes.STRING(10),
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


module.exports = Card;