const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');

class PacientHasProtocol extends Model {}

PacientHasProtocol.init({},{
    sequelize,
    tableName: 'pacient_has_protocol',
    modelName: 'pacient_has_protocol',
    timestamps: false
})