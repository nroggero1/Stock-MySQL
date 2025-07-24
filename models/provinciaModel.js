const sql = require('mssql');
const config = require('../data/data'); 

// Obtener todas las provincias
async function getProvincias() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM Provincia');
        return result.recordset;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getProvincias   
};