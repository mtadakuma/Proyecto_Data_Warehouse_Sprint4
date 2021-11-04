const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Regions = sequelize.define('regions',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: "regions",
    underscored: true,
});

module.exports = Regions;
