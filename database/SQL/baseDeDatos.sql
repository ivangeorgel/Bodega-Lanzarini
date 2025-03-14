-- CREATE DATABASE mi_base;
-- USE mi_base;

-- CREATE TABLE preguntas (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     pregunta TEXT NOT NULL,
--     fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- INSERT INTO preguntas (pregunta) VALUES ('¿Cómo aprendiste SQL?');
-- SELECT * FROM preguntas;


-- Crear la base de datos
CREATE DATABASE mi_base;

-- Usar la base de datos recién creada
USE mi_base;

-- Crear la tabla contactos
CREATE TABLE contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

