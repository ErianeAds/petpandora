require('dotenv').config();
const mysql = require('mysql2');

// Criação de uma pool de conexões para maior performance e controle
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',        // Adicionando fallback
  user: process.env.DB_USER || 'root',             // Adicionando fallback
  password: process.env.DB_PASSWORD || '',        // Adicionando fallback
  database: process.env.DB_NAME || 'petpandora',   // Adicionando fallback
  waitForConnections: true,                        // Aguarda conexões disponíveis
  connectionLimit: 10,                             // Limite de conexões simultâneas
  queueLimit: 0                                    // Sem limite na fila de espera
});

// Usando Promise para tornar a pool compatível com async/await
const promisePool = pool.promise();

module.exports = promisePool;
