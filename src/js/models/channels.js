const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Channels = sequelize.define('channels',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: "channels",
    underscored: true,
});

module.exports = Channels;
