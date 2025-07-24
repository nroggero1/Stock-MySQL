const sql = require('mssql');
const config = require('../data/data'); 

// Obtener todos los usuarios
async function getUsuarios() {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM Usuario');
        return result.recordset;
    } catch (err) {
        throw err;
    }
}

// Agregar un nuevo usuario
async function agregarUsuario(nombreUsuario, clave, nombre, apellido, mail, fechaNacimiento) {
    try {
        let pool = await sql.connect(config);
        const fechaAlta = new Date(); // Hora del sistema
        const activo = true; // Por defecto
        const administrador = false; // Por defecto
        await pool.request()
            .input('NombreUsuario', sql.NVarChar(50), nombreUsuario)
            .input('Clave', sql.NVarChar(50), clave)
            .input('Nombre', sql.NVarChar(50), nombre)
            .input('Apellido', sql.NVarChar(50), apellido)
            .input('Mail', sql.NVarChar(100), mail)
            .input('FechaNacimiento', sql.DateTime, fechaNacimiento)
            .input('Administrador', sql.Bit, administrador) // <-- Agrega esta línea
            .input('FechaAlta', sql.DateTime, fechaAlta)
            .input('Activo', sql.Bit, activo)
            .query('INSERT INTO Usuario (NombreUsuario, Clave, Nombre, Apellido, Mail, FechaNacimiento, Administrador, FechaAlta, Activo) VALUES (@NombreUsuario, @Clave, @Nombre, @Apellido, @Mail, @FechaNacimiento, @Administrador, @FechaAlta, @Activo)');
    } catch (err) {
        throw err;
    }
}

// Modificar un usuario existente
async function modificarUsuario(id, nombreUsuario, clave, nombre, apellido, mail, fechaNacimiento, administrador, fechaAlta, activo) {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .input('NombreUsuario', sql.NVarChar(50), nombreUsuario)
            .input('Clave', sql.NVarChar(50), clave)
            .input('Nombre', sql.NVarChar(50), nombre)
            .input('Apellido', sql.NVarChar(50), apellido)
            .input('Mail', sql.NVarChar(100), mail)
            .input('FechaNacimiento', sql.DateTime, fechaNacimiento)
            .input('Administrador', sql.Bit, administrador)
            .input('FechaAlta', sql.DateTime, fechaAlta)
            .input('Activo', sql.Bit, activo)
            .query(`UPDATE Usuario SET 
                NombreUsuario = @NombreUsuario,
                Clave = @Clave,
                Nombre = @Nombre,
                Apellido = @Apellido,
                Mail = @Mail,
                FechaNacimiento = @FechaNacimiento,
                Administrador = @Administrador,
                FechaAlta = @FechaAlta,
                Activo = @Activo
                WHERE Id = @Id`);
    } catch (err) {
        throw err;
    }
}

// Eliminar un Usuario
async function eliminarUsuario(id) {
    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('Id', sql.Int, id)
            .query('DELETE FROM Usuario WHERE Id = @Id');
    } catch (err) {
        throw err;
    }
}

module.exports = {
    getUsuarios,
    agregarUsuario,
    modificarUsuario,
    eliminarUsuario
}