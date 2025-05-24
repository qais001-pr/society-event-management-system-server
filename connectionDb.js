const mssql = require('mssql');
require('dotenv').config();
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST, // "host" should be "server" in mssql config
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433, // Default SQL Server port
    options: {
        trustServerCertificate: true // For local development
    }
};


async function connectionDb() {
    try {
        const pool = await mssql.connect(config);
        console.log('Connected to the database Successfully');
        return pool;
    } catch (error) {
        console.error('Database connection error');
    }
}
module.exports = {
connectionDb
};