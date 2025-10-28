// Acceder a los datos .env
require("dotenv").config();

// Promesa de MySQL
const mysql = require("mysql2/promise");

// Crear la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// Exportar la conexión
module.exports = pool;
