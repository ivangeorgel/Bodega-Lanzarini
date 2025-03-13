
// Importación de dependencias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

// Crear una instancia de la aplicación Express
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());  // Procesar JSON correctamente
// app.use(cors());  // Permitir solicitudes desde el frontend
app.use(cors({
    origin: '*',  // ⚠ En producción, restringe a tu dominio real
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type']
}));


// Configuración de Sequelize para conectar a MySQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {  
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,  // Por defecto usa el puerto 3306
    logging: false
});


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
            isEmail: true  // Asegura que sea un email válido
        }
    },
    mensaje: {
        type: DataTypes.TEXT,  // Puede ser más largo
        allowNull: false
    }
}, {
    tableName: 'contactos',
    timestamps: true  // Habilita createdAt y updatedAt automáticamente
});

// Verificar conexión a la base de datos
sequelize.authenticate()
    .then(() => console.log('✅ Conexión a MySQL exitosa'))
    .catch(err => console.error('❌ Error al conectar a MySQL:', err));


// Sincronizar el modelo con la base de datos
sequelize.sync()
    .then(() => console.log('✅ Modelo sincronizado con la base de datos'))
    .catch(err => console.log('❌ Error al sincronizar modelo:', err));

// Ruta para recibir datos del formulario
app.post('/contacto', async (req, res) => {
    console.log("📩 Datos recibidos en el servidor:", req.body);  // <-- Verifica los datos

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

