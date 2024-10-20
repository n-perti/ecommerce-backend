const { check, body } = require('express-validator');
const Commerce = require('../models/nosql/commerce');

const validateGetCommerceByCIF = [
    check('cif')
        .isLength({ min: 8, max: 9 })
        .withMessage('CIF must be between 8 and 9 characters long')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('CIF must contain only uppercase letters and numbers')
];

const validateSaveCommerce = [
    check('name')
        .notEmpty()
        .withMessage('Name is required'),
    check('cif')
        .isLength({ min: 8, max: 9 })
        .withMessage('CIF must be between 8 and 9 characters long')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('CIF must contain only uppercase letters and numbers'),
        
    check('address')
        .notEmpty()
        .withMessage('Address is required'),
    check('email')
        .isEmail()
        .withMessage('Email must be valid'),
    check('phone')
        .matches(/^\d{3}-\d{3}-\d{4}$/)
        .withMessage('Phone must be in the format 123-456-7890'),
    check('pageId')
        .isInt({ min: 1 })
        .withMessage('Page ID must be a positive integer'),
    body('cif').custom(async (value) => {
        const commerce = await Commerce.findOne({ cif: value });
        if (commerce) {
            return Promise.reject('CIF already in use');
        }
    })
];

const validateUpdateCommerce = [
    check('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty'),
    check('address')
        .optional()
        .notEmpty()
        .withMessage('Address cannot be empty'),
    check('email')
        .optional()
        .isEmail()
        .withMessage('Email must be valid'),
    check('phone')
        .optional()
        .matches(/^\d{3}-\d{3}-\d{4}$/)
        .withMessage('Phone must be in the format 123-456-7890'),
    check('pageId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page ID must be a positive integer')
];

const validateDeleteCommerce = [
    check('cif')
        .isLength({ min: 8, max: 9 })
        .withMessage('CIF must be between 8 and 9 characters long')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('CIF must contain only uppercase letters and numbers'),
    check('borrado')
        .optional()
        .isIn(['logico', 'fisico'])
        .withMessage('Borrado must be either "logico" or "fisico"')
];

module.exports = {
    validateGetCommerceByCIF,
    validateSaveCommerce,
    validateUpdateCommerce,
    validateDeleteCommerce
};