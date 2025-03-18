// Importación de dependencias
require('dotenv').config();  // <-- 🔹 Cargar variables de entorno desde .env
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());  
app.use(cors({
    origin: '*',  
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));

// 🔹 🔹 CONEXIÓN A MYSQL EN RAILWAY 🔹 🔹
const sequelize = new Sequelize(
    process.env.MYSQLDATABASE,   // Nombre de la base de datos
    process.env.MYSQLUSER,       // Usuario
    process.env.MYSQLPASSWORD,   // Contraseña
    {
        host: process.env.MYSQLHOST, // Host
        dialect: 'mysql',
        port: process.env.MYSQLPORT, // Puerto
        logging: false  // Desactiva logs innecesarios
    }
);

// Definir el modelo Contacto
const Contacto = sequelize.define('Contacto', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true  
        }
    },
    mensaje: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'contactos',
    timestamps: true  
});

// 🔹 🔹 VERIFICAR CONEXIÓN 🔹 🔹
sequelize.authenticate()
    .then(() => console.log('✅ Conexión a MySQL en Railway exitosa'))
    .catch(err => console.error('❌ Error al conectar a MySQL:', err));

sequelize.sync()
    .then(() => console.log('✅ Modelo sincronizado con la base de datos'))
    .catch(err => console.log('❌ Error al sincronizar modelo:', err));

// Ruta para recibir datos del formulario
app.post('/contacto', async (req, res) => {
    console.log("📩 Datos recibidos en el servidor:", req.body);

    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const nuevoContacto = await Contacto.create({ nombre, email, mensaje });
        console.log('✅ Nuevo contacto guardado:', nuevoContacto);
        res.status(201).json({ message: 'Contacto guardado correctamente' });
    } catch (err) {
        console.error('❌ Error al guardar contacto:', err);
        res.status(500).json({ error: `Error interno del servidor: ${err.message}` });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
