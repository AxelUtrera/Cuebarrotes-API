// Tus imports existentes
const { body, validationResult } = require('express-validator');
const Branch = require('../models/branchModel');

const createBranchValidationRules = () => {
    return [
        body('nombreComercial').notEmpty().withMessage('El nombre comercial es requerido').trim().escape(),
        body('direccion').notEmpty().withMessage('La dirección es requerida').trim().escape(),
        body('horarioServicio').notEmpty().withMessage('El horario de servicio es requerido').trim().escape(),
        body('ubicacion.latitud').isFloat({ min: -90, max: 90 }).withMessage('Latitud inválida'),
        body('ubicacion.longitud').isFloat({ min: -180, max: 180 }).withMessage('Longitud inválida'),
    ];
};

const validateCreateBranch = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const checkBranchExists = async (req, res, next) => {
    try {
      const { nombreComercial, direccion, ubicacion } = req.body;
  
      
      const existingBranch = await Branch.findOne({
        $or: [
          { nombreComercial: nombreComercial },
          { direccion: direccion },
          { 'ubicacion.latitud': ubicacion.latitud, 'ubicacion.longitud': ubicacion.longitud }
        ]
      });
  
      if (existingBranch) {
        return res.status(400).json({ message: 'La sucursal con estos datos ya existe.' });
      }
  
      next(); 
    } catch (error) {
      res.status(500).json({ message: 'Error al verificar la sucursal', error: error.message });
    }
  };

module.exports = { createBranchValidationRules, validateCreateBranch, checkBranchExists };
