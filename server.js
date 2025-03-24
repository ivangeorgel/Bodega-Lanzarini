// Importación de dependencias
require("dotenv").config({ path: "./.env" }); // 🔹 Solo útil en local
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000; // 🚀 Usar puerto dinámico de Railway

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);

// Imprime las variables de entorno para depuración
console.log("🔍 MYSQL_HOST:", process.env.MYSQL_HOST);
console.log("🔍 MYSQL_USER:", process.env.MYSQL_USER);
console.log("🔍 MYSQL_DATABASE:", process.env.MYSQL_DATABASE);

// ✅ Configurar la conexión con MySQL en Railway
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST, // Servidor de la base de datos
  user: process.env.MYSQL_USER, // Usuario de la base de datos
  password: process.env.MYSQL_PASSWORD, // Contraseña de la base de datos
  database: process.env.MYSQL_DATABASE, // Nombre de la base de datos
  port: process.env.MYSQL_PORT || 3306, // Puerto de MySQL (Railway usa 3306)
});

// ✅ Intentar conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
    return;
  }
  console.log("✅ Conexión exitosa a MySQL en Railway");
});

// Ruta para recibir datos del formulario
app.post("/contacto", async (req, res) => {
  console.log("📩 Datos recibidos en el servidor:", req.body);

  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Insertar datos en MySQL
  const query = "INSERT INTO contactos (nombre, email, mensaje) VALUES (?, ?, ?)";
  
  connection.query(query, [nombre, email, mensaje], (err, results) => {
    if (err) {
      console.error("❌ Error al guardar contacto:", err);
      return res.status(500).json({ error: `Error interno del servidor: ${err.message}` });
    }
    console.log("✅ Nuevo contacto guardado:", results);
    res.status(201).json({ message: "Contacto guardado correctamente" });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
