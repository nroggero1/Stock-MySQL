const sql = require('mssql');
const config = require('../data/data');

// Obtener todas las localidades de una provincia
async function getLocalidadesPorProvincia(idProvincia) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('IdProvincia', sql.Int, idProvincia)
            .query('SELECT Id, Nombre FROM Localidad WHERE IdProvincia = @IdProvincia ORDER BY Nombre');
        return result.recordset;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getLocalidadesPorProvincia
};
