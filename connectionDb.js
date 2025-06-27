const mssql = require('mssql');
require('dotenv').config();
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 1433, 
    options: {
        trustServerCertificate: true 
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