const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        database: 'company'
    },
    console.log('Connected')
);

module.exports = db;