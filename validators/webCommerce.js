const { check, body } = require('express-validator');
const webCommerceModel = require('../models/nosql/webCommerce');
const commerceModel = require('../models/nosql/commerce');


// Validate getWebCommercebyCIF

const validateGetWebCommerceByCIF = [
    check('commerceCIF')
        .isLength({ min: 8, max: 9 })
        .withMessage('CIF must be between 8 and 9 characters long')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('CIF must contain only uppercase letters and numbers')
];

// Validate createWebCommerce with model data and check if commerceCIF exists in commerce table

const validateCreateWebCommerce = [
    check('commerceCIF')
        .isLength({ min: 8, max: 9 })
        .withMessage('CIF must be between 8 and 9 characters long')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('CIF must contain only uppercase letters and numbers'),
    body('commerceCIF').custom(async (value) => {
        const commerce = await commerceModel.findOne({ cif: value });
        if (!commerce) {
            return Promise.reject('CIF not found in commerce table');
        }
        const webCommerce = await webCommerceModel.findOne({ commerceCIF: value });
        if (webCommerce) {
            return Promise.reject('CIF already has a web commerce');
        }
    })
];

// Validate updateWebCommerce

const validateUpdateWebCommerce = [
    check('webCommerceData')
        .optional()
        .notEmpty()
        .withMessage('Web Commerce Data cannot be empty')
];




const validateArchiveOrDeleteWebCommerce = [
    check('commerceCIF')
        .isLength({ min: 8, max: 9 })
        .withMessage('CIF must be between 8 and 9 characters long')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('CIF must contain only uppercase letters and numbers'),
    
    check('action')
        .optional()
        .isIn(['archive', 'delete'])
        .withMessage('action must be a boolean')
];

const validateUploadWebCommerceImage = [
    check('commerceCIF')
        .isLength({ min: 8, max: 9 })
        .withMessage('CIF must be between 8 and 9 characters long')
        .matches(/^[A-Z0-9]+$/)
        .withMessage('CIF must contain only uppercase letters and numbers'),
    
    check('image')
        .optional()
        .notEmpty()
        .withMessage('Image cannot be empty')
];


module.exports = {
    validateGetWebCommerceByCIF,
    validateCreateWebCommerce,
    validateUpdateWebCommerce,
    validateArchiveOrDeleteWebCommerce,
    validateUploadWebCommerceImage
};


