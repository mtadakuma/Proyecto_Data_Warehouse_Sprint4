const Users = require("./users");
const Regions = require("./regions");
const Countries = require("./countries");
const Cities = require("./cities");
const Companies = require("./companies");
const Contacts = require("./contacts");
const Channels = require("./channels");
const ContactsHasChannels = require("./contactsHasChannels");

Regions.hasMany(Countries, {
    foreignKey: "region_id"
});
Countries.belongsTo(Regions, {
    foreignKey: "region_id",
});

Countries.hasMany(Cities, {
    foreignKey: "countries_id"
});
Cities.belongsTo(Countries, {
    foreignKey: "countries_id",
});

Cities.hasMany(Companies, {
    foreignKey: "cities_id",
});

Companies.belongsTo(Cities, {
    foreignKey: "cities_id",
});

Cities.hasMany(Contacts, {
    foreignKey: "cities_id",
})

Contacts.belongsTo(Cities, {
    foreignKey: "cities_id",
});

Companies.hasMany(Contacts, {
    foreignKey: "companies_id",
})

Contacts.belongsTo(Companies, {
    foreignKey: "companies_id",
});

Contacts.belongsToMany(Channels,{
    through: ContactsHasChannels,
});


module.exports = {
    Users,
    Regions,
    Countries,
    Cities,
    Companies,
    Contacts,
    Channels,
    ContactsHasChannels,
};