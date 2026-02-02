const express = require('express');
const router = express.Router();
const Institucion = require('../models/institucion.model');

// @route   POST /api/instituciones
// @desc    Registrar una nueva institucion
// @access  Public

// POST /api/instituciones
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      telefono,
      tipoOrganizacion,
      direccion,
      barrio,
      encargado,
      poblacionVinculada,
      diasHorarios,
      actividadEspacio,
      coordenadas,
      cuentaConInternet,
      cuentaConDispositivo
    } = req.body;

    if (!nombre || !telefono || !encargado) {
      return res.status(400).json({ message: 'Los campos nombre, teléfono y encargado son obligatorios.' });
    }

    const nuevaInstitucion = new Institucion({
      nombre,
      telefono,
      tipoOrganizacion,
      direccion,
      barrio,
      encargado,
      poblacionVinculada,
      diasHorarios,
      actividadEspacio,
      coordenadas,
      cuentaConInternet,
      cuentaConDispositivo
    });

    const institucionGuardada = await nuevaInstitucion.save();

    res.status(201).json({
      message: 'Institución registrada exitosamente.',
      data: institucionGuardada
    });

  } catch (error) {
    console.error('Error al registrar la institución:', error);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
  }
});

router.get('/', async (req, res) => {

  res.status(200).json({bruno: 'hola'})
  
});

module.exports = router;
