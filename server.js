const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ Conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT,
});
console.log("🔍 Verificando variables de entorno...");
console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQL_DATABASE:", process.env.MYSQL_DATABASE);
console.log("MYSQLPASSWORD:", process.env.MYSQLPASSWORD);
console.log("MYSQLPORT:", process.env.MYSQLPORT);

// 🔧 Intentar conectar a MySQL
connection.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar a MySQL:", err.message);
    return;
  }
  console.log("✅ Conexión exitosa a MySQL en Railway");
});

// 🌐 Ruta de prueba
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
      console.error("❌ Error al guardar mensaje en la base de datos:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json({ message: "Mensaje enviado correctamente" });
  });
});

// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});

