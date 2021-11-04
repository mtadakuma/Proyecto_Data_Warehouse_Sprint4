const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Countries = sequelize.define('countries',{
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
    region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: "countries",
    underscored: true,
});

module.exports = Countries;
