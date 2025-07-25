const sql = require('mssql');
const config = require('../data/data');

// Obtener todos los usuarios
async function getUsuarios() {
    let pool = await sql.connect(config);
    let result = await pool.request().query('SELECT * FROM Usuario');
    return result.recordset;
}

// Obtener un usuario por ID
async function getUsuarioPorId(id) {
    let pool = await sql.connect(config);
    let result = await pool.request()
        .input('Id', sql.Int, id)
        .query('SELECT * FROM Usuario WHERE Id = @Id');
    return result.recordset[0];
}

// Insertar un nuevo usuario
async function insertarUsuario(datos) {
    const { nombreUsuario, clave, nombre, apellido, mail, fechaNacimiento } = datos;
    const fechaAlta = new Date();
    const activo = true;
    const administrador = false;

    let pool = await sql.connect(config);
    await pool.request()
        .input('NombreUsuario', sql.NVarChar(50), nombreUsuario)
        .input('Clave', sql.NVarChar(50), clave)
        .input('Nombre', sql.NVarChar(50), nombre)
        .input('Apellido', sql.NVarChar(50), apellido)
        .input('Mail', sql.NVarChar(100), mail)
        .input('FechaNacimiento', sql.DateTime, fechaNacimiento)
        .input('Administrador', sql.Bit, administrador)
        .input('FechaAlta', sql.DateTime, fechaAlta)
        .input('Activo', sql.Bit, activo)
        .query(`
            INSERT INTO Usuario 
            (NombreUsuario, Clave, Nombre, Apellido, Mail, FechaNacimiento, Administrador, FechaAlta, Activo)
            VALUES 
            (@NombreUsuario, @Clave, @Nombre, @Apellido, @Mail, @FechaNacimiento, @Administrador, @FechaAlta, @Activo)
        `);
}

// Actualizar un usuario
async function actualizarUsuario(id, datos) {
    const { nombreUsuario, clave, nombre, apellido, mail, fechaNacimiento, administrador, activo } = datos;

    let pool = await sql.connect(config);
    await pool.request()
        .input('Id', sql.Int, id)
        .input('NombreUsuario', sql.NVarChar(50), nombreUsuario)
        .input('Clave', sql.NVarChar(50), clave)
        .input('Nombre', sql.NVarChar(50), nombre)
        .input('Apellido', sql.NVarChar(50), apellido)
        .input('Mail', sql.NVarChar(100), mail)
        .input('FechaNacimiento', sql.DateTime, fechaNacimiento)
        .input('Administrador', sql.Bit, administrador === '1' || administrador === true)
        .input('Activo', sql.Bit, activo === '1' || activo === true)
        .query(`
            UPDATE Usuario SET 
                NombreUsuario = @NombreUsuario,
                Clave = @Clave,
                Nombre = @Nombre,
                Apellido = @Apellido,
                Mail = @Mail,
                FechaNacimiento = @FechaNacimiento,
                Administrador = @Administrador,
                Activo = @Activo
            WHERE Id = @Id
        `);
}

// Eliminar usuario
async function eliminarUsuario(id) {
    let pool = await sql.connect(config);
    await pool.request()
        .input('Id', sql.Int, id)
        .query('DELETE FROM Usuario WHERE Id = @Id');
}

module.exports = {
    getUsuarios,
    getUsuarioPorId,
    insertarUsuario,
    actualizarUsuario,
    eliminarUsuario
};
