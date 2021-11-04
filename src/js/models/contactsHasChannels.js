const {DataTypes} = require("sequelize");
const sequelize = require('../config/db');
const Contacts = require("./contacts");
const Channels = require("./channels");
const ContactsHasChannels = sequelize.define("contacts_has_channels",{
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field:"channel_id",
        references: {
            model:Channels,
            key:"id",
        }
    },
    contact_id: {
        type:DataTypes.INTEGER,
        allowNull: false,
        field:"contact_id",
        references:{ 
            model:Contacts,
            key: "id",
        }
    },
    account: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    preferences: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        field:"isActive",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
},{
    tableName: "contacts_has_channels",
    underscored: true,
    timestamps: false,
});

module.exports = ContactsHasChannels;