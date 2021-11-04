const { Sequelize } = require("sequelize");
const {DB_USER, DB_PASS, DB_HOST, DB_NAME,DB_PORT} = process.env;

const conString = `mysql://${DB_USER}${
    DB_PASS ? `:${DB_PASS}` : "" 
}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;


const instanciaSequelize = new Sequelize(conString, {
    operatorsAliases:false,
});

instanciaSequelize
.authenticate()
.then(()=>{
    console.log("conexion exitosa");
})
.catch((err)=>{
    console.log(err.message);
});

module.exports = instanciaSequelize;