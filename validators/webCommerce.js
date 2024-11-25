const { check, body, param } = require("express-validator");
const webCommerceModel = require("../models/nosql/webCommerce");

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
    .withMessage("CIF must contain only uppercase letters and numbers")
    .custom(async (value) => {
      const existingWebCommerce = await webCommerceModel.findOne({ commerceCIF: value });
      if (existingWebCommerce) {
        return Promise.reject("WebCommerce with this CIF already exists");
      }
    }),

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
  // Exclude commerceCIF from being updated to prevent changing ownership
  check("title").optional().notEmpty().withMessage("Title is required"),
  check("summary").optional().notEmpty().withMessage("Summary is required"),
  check("text")
    .optional()
    .isArray()
    .withMessage("Text must be an array"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),
  // Do not include validation for usersReview fields
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

const validateGetWebCommercesByCity = [
  check('city')
    .notEmpty()
    .withMessage('City is required')
    .isString()
    .withMessage('City must be a string'),
];

// Validate createReview

const validateCreateReview = [
  param("commerceCIF")
    .isLength({ min: 8, max: 9 })
    .withMessage("CIF must be between 8 and 9 characters long")
    .matches(/^[A-Z0-9]+$/)
    .withMessage("CIF must contain only uppercase letters and numbers"),
  check("review")
    .notEmpty()
    .withMessage("Review text is required")
    .isString()
    .withMessage("Review must be a string"),
  check("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be a number between 0 and 5"),
];

const validateGetWebCommercesByActivity = [
  check('activity')
    .notEmpty()
    .withMessage('Activity is required')
    .isString()
    .withMessage('Activity must be a string'),
];


module.exports = {
  validateGetWebCommerceByCIF,
  validateCreateWebCommerce,
  validateUpdateWebCommerce,
  validateArchiveOrDeleteWebCommerce,
  validateUploadWebCommerceImage,
  validateGetWebCommercesByCity,
  validateCreateReview,
  validateGetWebCommercesByActivity
};
