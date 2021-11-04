# Proyecto Data Warehouse :rocket:
Proyecto Data Warehouse para carrera Full Stack Web Developer de Acamica.

## Description
The Data Warehouse in this project has been designed for a marketing company to store and manage
all it's contacts through all regions / countries / cities the contacts are located in performing the CRUD
operations needed for each of the segments: Contacts, Users, Region/Cities and Companies.

### Technologies used in this project

- Node.JS
- Express
- MySQL
- Cors
- JWT (JSON Web Token)
- JavaScript/HTML/CSS
- Git
- Nodemon
- Sequelize

## Getting Started

### Installation

1. Clone the repository: https://github.com/mtadakuma/Proyecto_Data_Warehouse_Sprint4.git
2. Open the project in Visual Studio Code
3. Install the dependencies for the project
```
npm install
```
4. Open XAMPP and start the MySQL Module.
5. Open MySQLWorkbench and open a new connection.
6. Run the script "**script creacion DB.txt**" in MySQLWorkbench

## Initialization

### SQL
- The following are manual inserts that should be inserted into the tables for a first start
```
--usuario administrador de prueba
INSERT INTO users (first_name, last_name, email, password, username) values('admin','istrator','admin@gmail.com','pass123', 'admin');

--canales
INSERT INTO channels (name) values ('Whatsapp');
INSERT INTO channels (name) values ('Facebook');
INSERT INTO channels (name) values ('Instagram');
INSERT INTO channels (name) values ('Email');
```

### Node

- Initialize the server using the command
```
npm run dev
```
- If everything is OK you will recieve this message:
>Servidor iniciado correctamente en el puerto 3000



## Use the API 

#### **Endpoints**

- LOGIN (http://localhost:3000/login)
  Methods:
  - POST
  *Note: a user can log in if the account already exists and was created by an administrator*
  

- USERS (http://localhost:3000/users)
  Methods
  - GET
  - POST
  - PUT > by ID
  - DELETE > by ID
 
- REGIONS / CITIES (http://localhost:3000/allRegionsCities)
  Methods
  - GET

- REGIONS (http://localhost:3000/regions)
  Methods
  - POST

- COUNTRIES (http://localhost:3000/countries)
  Methods
  - POST
  - PUT > by ID
  - DELETE > by ID
  
- CITIES (http://localhost:3000/cities)
  Methods
  - POST
  - PUT > by ID
  - DELETE > by ID
  
- COMPANIES (http://localhost:3000/companies)
  Methods
  - GET
  - POST
  - PUT > by ID
  - DELETE > by ID
  
- CONTACTS (http://localhost:3000/contacts)
  Methods
  - GET
  - POST
  - PUT > by ID
  - DELETE
  - DELETE > by ID
 
- CHANNELS (http://localhost:3000/channels)
  Methods
  - GET
