CREATE DATABASE mi_base;
USE mi_base;

CREATE TABLE contactos (
id INT auto_increment PRIMARY KEY,
nombre varchar(255) NOT NULL, 
email VARCHAR (255) NOT NULL,
mensaje TEXT NOT NULL,
cratedAt timestamp default current_timestamp,
updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP  ON UPDATE CURRENT_TIMESTAMP
);