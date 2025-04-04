require('dotenv').config();

// 🌍 Imprimir variables de entorno para depuración
console.log("📌 Verificando variables de entorno:");
console.log("Host:", process.env.MYSQLHOST);
console.log("User:", process.env.MYSQLUSER);
console.log("Password:", process.env.MYSQLPASSWORD ? "✅ Oculta por seguridad" : "❌ No definida");
console.log("Database:", process.env.MYSQL_DATABASE);
console.log("Port:", process.env.MYSQLPORT);

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3001; // Puerto del servidor

// ✅ Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ Configurar conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.MYSQLHOST || 'shuttle.proxy.rlwy.net', // Host de Railway
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT || 42838, // Puerto externo de Railway
});

// 🔧 Intentar conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.code, err.message);
    return;
  }
  console.log("✅ Conexión exitosa a MySQL en Railway 🚀");
});

// 🌍 Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// ✉️ Ruta para recibir mensajes del formulario
app.post("/enviar-mensaje", (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)";
  connection.query(sql, [nombre, email, mensaje], (err, result) => {
    if (err) {
      console.error("❌ Error al guardar mensaje en la base de datos:", err.message);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  });
});

// 🛑 Cerrar la conexión cuando el servidor se apaga
process.on("exit", () => {
  console.log("🛑 Cerrando conexión a MySQL...");
  connection.end();
});

// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
