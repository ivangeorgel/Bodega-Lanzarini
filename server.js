// Importación de dependencias
require('dotenv').config();  // 🔹 Solo útil en local
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');  // Importación correcta de Sequelize

const app = express();
const port = process.env.PORT || 3000; // 🚀 Usar puerto dinámico de Railway

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));

// Validación de la variable de entorno MYSQL_URL
const dbUrl = process.env.MYSQL_URL;
if (!dbUrl) {
    console.error('❌ Error: La variable de entorno MYSQL_URL no está definida');
    process.exit(1); // Salir si no se encuentra la variable de entorno
}

// 🔹 🔹 CONEXIÓN A MYSQL EN RAILWAY 🔹 🔹
const sequelize = new Sequelize(dbUrl, {
    dialect: "mysql",
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("✅ Conexión a la base de datos exitosa.");
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
    } finally {
        await sequelize.close();
    }
}

testConnection();

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

// Sincronización del modelo con la base de datos
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
