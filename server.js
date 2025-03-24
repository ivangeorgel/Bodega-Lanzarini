require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// 🔍 Imprimir variables de entorno (solo para depuración)
console.log("🔍 MYSQLHOST:", process.env.MYSQLHOST);
console.log("🔍 MYSQLUSER:", process.env.MYSQLUSER);
console.log("🔍 MYSQL_DATABASE:", process.env.MYSQL_DATABASE);
console.log("🔍 MYSQLPORT:", process.env.MYSQLPORT);

// ✅ Configurar conexión con MySQL en Railway
const connection = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQL_DATABASE || "test",
  port: process.env.MYSQLPORT || 3306,
});

// ✅ Intentar conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
    return;
  }
  console.log("✅ Conexión exitosa a MySQL en Railway");
});

// Ruta de prueba para verificar conexión
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});


// Modificar server.js para recibir los datos
// Edita server.js y agrega esta ruta para manejar el formulario:


app.post("/enviar-mensaje", (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO mensajes (nombre, email, mensaje) VALUES (?, ?, ?)";
  connection.query(sql, [nombre, email, mensaje], (err, result) => {
    if (err) {
      console.error("❌ Error al guardar mensaje en la base de datos:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  });
});