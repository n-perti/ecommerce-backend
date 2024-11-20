const { check, body } = require("express-validator");

// Validate getWebCommercebyCIF

const validateGetWebCommerceByCIF = [
  check("commerceCIF")
    .isLength({ min: 8, max: 9 })
    .withMessage("CIF must be between 8 and 9 characters long")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("CIF must contain only uppercase letters and numbers"),
];

// Validate createWebCommerce with model data and check if commerceCIF exists in commerce table

const validateCreateWebCommerce = [
  check("commerceCIF")
    .isLength({ min: 8, max: 9 })
    .withMessage("CIF must be between 8 and 9 characters long")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("CIF must contain only uppercase letters and numbers"),

  check("city").notEmpty().withMessage("City is required"),

  check("activity").notEmpty().withMessage("Activity is required"),

  check("title").notEmpty().withMessage("Title is required"),

  check("summary").notEmpty().withMessage("Summary is required"),

  check("text")
    .isArray()
    .withMessage("Text must be an array")
    .notEmpty()
    .withMessage("Text is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),

  check("usersReview")
    .optional()
    .isObject()
    .withMessage("usersReview debe ser un objeto"),

  check("usersReview.scoring")
    .optional()
    .isNumeric()
    .withMessage("scoring debe ser un número"),

  check("usersReview.totalReviews")
    .optional()
    .isNumeric()
    .withMessage("totalReviews debe ser un número"),

  check("usersReview.review")
    .optional()
    .isArray()
    .withMessage("review debe ser un arreglo"),

  check("usersReview.review.*.review")
    .optional()
    .isString()
    .withMessage("El campo review debe ser una cadena de texto"),

  check("usersReview.review.*.rating")
    .optional()
    .isNumeric()
    .withMessage("El campo rating debe ser un número"),

  check("usersReview.review.*.date")
    .optional()
    .isISO8601()
    .withMessage("El campo date debe ser una fecha válida"),

  check("isArchived")
    .optional()
    .isBoolean()
    .withMessage("isArchived must be a boolean"),
];

// Validate updateWebCommerce

const validateUpdateWebCommerce = [
  check("commerceCIF")
    .isLength({ min: 8, max: 9 })
    .withMessage("CIF must be between 8 and 9 characters long")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("CIF must contain only uppercase letters and numbers"),

  check("city").optional().notEmpty().withMessage("City is required"),

  check("activity").optional().notEmpty().withMessage("Activity is required"),

  check("title").optional().notEmpty().withMessage("Title is required"),

  check("summary").optional().notEmpty().withMessage("Summary is required"),

  check("text")
    .optional()
    .isArray()
    .withMessage("Text must be an array")
    .notEmpty()
    .withMessage("Text is required"),

  check("isArchived")
    .optional()
    .isBoolean()
    .withMessage("isArchived must be a boolean"),
];

const validateArchiveOrDeleteWebCommerce = [
  check("commerceCIF")
    .isLength({ min: 8, max: 9 })
    .withMessage("CIF must be between 8 and 9 characters long")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("CIF must contain only uppercase letters and numbers"),

  check("action")
    .optional()
    .isIn(["archive", "delete"])
    .withMessage("action must be a boolean"),
];

const validateUploadWebCommerceImage = [
  check("commerceCIF")
    .isLength({ min: 8, max: 9 })
    .withMessage("CIF must be between 8 and 9 characters long")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("CIF must contain only uppercase letters and numbers"),

  check("image").optional().notEmpty().withMessage("Image cannot be empty"),
];

module.exports = {
  validateGetWebCommerceByCIF,
  validateCreateWebCommerce,
  validateUpdateWebCommerce,
  validateArchiveOrDeleteWebCommerce,
  validateUploadWebCommerceImage,
};
