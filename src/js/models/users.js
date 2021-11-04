const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");


const Users = sequelize.define('users',{
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isAdmin: {
        field:"isAdmin",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        field:"isAdmin",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
    
},{
    tableName:"users",
    underscored: true,
});

module.exports = Users;