// Tus imports existentes
const { body, validationResult } = require('express-validator');

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

module.exports = { createBranchValidationRules, validateCreateBranch };
