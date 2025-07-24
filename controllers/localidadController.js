const localidadModel = require('../models/localidadModel');

// Devuelve localidades filtradas por provincia (JSON para AJAX)
exports.listarLocalidadesPorProvincia = async (req, res) => {
    try {
        const idProvincia = req.params.idProvincia;
        const localidades = await localidadModel.getLocalidadesPorProvincia(idProvincia);
        res.json(localidades);
    } catch (err) {
        console.error('Error al obtener localidades:', err);
        res.status(500).send('Error al obtener localidades');
    }
};
