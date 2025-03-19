require("dotenv").config();  // 🔹 Cargar variables de entorno
const mysql = require("mysql2");

// Crear la conexión usando MYSQL_URL
const connection = mysql.createConnection(process.env.MYSQL_URL);

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
