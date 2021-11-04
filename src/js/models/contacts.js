const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Contacts = sequelize.define('contacts', {
    firstName: {
        field:"firstName",
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        field:"lastName",
        type: DataTypes.STRING,
        allowNull: false,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cities_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    companies_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isActive: {
        field:"isActive",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    interest: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "contacts",
    underscored: true,
})

module.exports = Contacts;