const mysql = require("mysql")
require('dotenv').config()

const pool = mysql.createPool({
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
})

function executeQuery(conn, query) {
    return new Promise(function (resolve, reject) {
        conn.query(query, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    });
}

function getConnection() {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(err);
            } else {
                resolve(conn);
            }
        })
    });
}

module.exports = {
    "executeQuery": executeQuery,
    "getConnection": getConnection
}