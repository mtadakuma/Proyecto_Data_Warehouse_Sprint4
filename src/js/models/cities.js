const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Cities = sequelize.define('cities',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        field:"isActive",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    countries_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "cities",
    underscored: true,
});

module.exports = Cities;
