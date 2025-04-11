require('dotenv').config(); // para leer variables del .env

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middleware
app.use(bodyParser.json());
app.use(cors());


// ✅ Analizar el host y el puerto si están combinados
let dbHost = process.env.MYSQLHOST || process.env.HOST || 'localhost';
let dbPort = process.env.MYSQLPORT || process.env.DBPORT || 3306;

// Verificar si el host incluye el puerto (formato: host:port)
if (dbHost.includes(':')) {
  const parts = dbHost.split(':');
  dbHost = parts[0];
  dbPort = parseInt(parts[1]);
  console.log("🔄 Host y puerto separados:", dbHost, dbPort);
}

// Actualizar la configuración
const dbConfig = {
  host: dbHost,
  user: process.env.MYSQLUSER || process.env.USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DATABASE || 'nombre_base',
  port: dbPort
};



// ✅ Cargar variables de entorno con fallback
// const dbConfig = {
//   host: process.env.MYSQLHOST || process.env.HOST || 'localhost',
//   user: process.env.MYSQLUSER || process.env.USER || 'root',
//   password: process.env.MYSQLPASSWORD || process.env.PASSWORD || '',
//   database: process.env.MYSQL_DATABASE || process.env.DATABASE || 'nombre_base',
//   port: process.env.MYSQLPORT || process.env.DBPORT || 3306
// };

// 🌍 Mostrar variables de entorno (sin exponer la contraseña)
console.log("📌 Verificando variables de entorno:");
console.log("Host:", dbConfig.host);
console.log("User:", dbConfig.user);
console.log("Password:", dbConfig.password ? "✅ Oculta por seguridad" : "❌ No definida");
console.log("Database:", dbConfig.database);
console.log("Port:", dbConfig.port);

// ✅ Crear conexión MySQL
const connection = mysql.createConnection(dbConfig);

// 🔧 Intentar conectar
connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.code, err.message);
    return;
  }
  console.log("✅ Conexión exitosa a MySQL 🚀");
});

// 🌍 Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// ✉️ Ruta para recibir mensajes del formulario
app.post("/enviar-mensaje", (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)";
  connection.query(sql, [nombre, email, mensaje], (err, result) => {
    if (err) {
      console.error("❌ Error al guardar mensaje en la base de datos:", err.message);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  });
});

// 🛑 Cerrar conexión cuando el servidor se apaga
process.on("exit", () => {
  console.log("🛑 Cerrando conexión a MySQL...");
  connection.end();
});



// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

app.get("/probar-bd", (req, res) => {
  connection.query("SELECT 1 + 1 AS resultado", (err, results) => {
    if (err) {
      console.error("❌ Error al probar conexión a la BD:", err.message);
      return res.status(500).json({ error: "Error al conectar con la base de datos" });
    }
    res.status(200).json({ message: "Conexión a la base de datos exitosa 🚀", resultado: results[0].resultado });
  });
});


// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓


// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});


// Servir archivos estáticos desde la carpeta 'public'

app.use(express.static('public'));


// Implementa una ruta para probar la conexión del formulario:
// Para facilitar la depuración, añade una ruta de prueba para tu formulario:
app.get("/probar-formulario", (req, res) => {
  res.status(200).json({ message: "La ruta del formulario está funcionando correctamente" });
});