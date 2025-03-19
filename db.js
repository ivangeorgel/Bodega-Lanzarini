require("dotenv").config();  // Cargar variables de entorno
const mysql = require("mysql2");

// Configurar la conexión a MySQL en Railway usando variables de entorno
const connection = mysql.createConnection({
    host: process.env.MYSQLHOST,       // 🔹 Usa el host de Railway (NO "mysql.railway.internal")
    user: process.env.MYSQLUSER,       // 🔹 Usuario de la base de datos
    password: process.env.MYSQLPASSWORD, // 🔹 Contraseña de la base de datos
    database: process.env.MYSQLDATABASE, // 🔹 Nombre de la base de datos
    port: process.env.MYSQLPORT        // 🔹 Puerto de la base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err);
        return;
    }
    console.log("✅ Conectado a MySQL en Railway");
});

// Exportar la conexión
module.exports = connection;
