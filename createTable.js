const connection = require("./db");

// SQL para crear la tabla
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contactos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL, 
        email VARCHAR(255) NOT NULL,
        mensaje TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;

// Ejecutar la consulta
connection.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("❌ Error al crear la tabla:", err);
        return;
    }
    console.log("✅ Tabla 'contactos' creada correctamente");
    connection.end(); // Cierra la conexión después de la ejecución
});

