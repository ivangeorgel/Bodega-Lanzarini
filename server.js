require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3001;

// ✅ Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ Cargar variables de entorno con fallback
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DATABASE || 'nombre_base',
  port: process.env.MYSQLPORT || process.env.DBPORT || 3306
};

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

  const sql = "INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)";
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

// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
