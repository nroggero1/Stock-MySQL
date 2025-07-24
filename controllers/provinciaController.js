const provinciaModel = require('../models/provinciaModel');

// Mostrar todas las provincias

// Mostrar todas las provincias (para desplegable)
exports.listarProvincias = async (req, res) => {
    try {
        const provincias = await provinciaModel.getProvincias();
        res.json(provincias); 
    } catch (err) {
        console.error('Error al obtener provincias:', err);
        res.status(500).send('Error al obtener provincias');
    }
};
