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

  check("city")
    .notEmpty()
    .withMessage("City is required"),

  check("activity")
    .notEmpty()
    .withMessage("Activity is required"),

  check("title")
    .notEmpty()
    .withMessage("Title is required"),

  check("summary")
    .notEmpty()
    .withMessage("Summary is required"),

  check("text")
    .isArray()
    .withMessage("Text must be an array")
    .notEmpty()
    .withMessage("Text is required"),

  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),

  check("usersReview.scoring")
    .isNumeric()
    .withMessage("Scoring must be a number")
    .notEmpty()
    .withMessage("Scoring is required"),

  check("usersReview.totalReviews")
    .isNumeric()
    .withMessage("Total Reviews must be a number")
    .notEmpty()
    .withMessage("Total Reviews is required"),

  check("usersReview.review")
    .notEmpty()
    .withMessage("Review is required"),

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

  check("city")
    .optional()
    .notEmpty()
    .withMessage("City is required"),

  check("activity")
    .optional()
    .notEmpty()
    .withMessage("Activity is required"),

  check("title")
    .optional()
    .notEmpty()
    .withMessage("Title is required"),

  check("summary")
    .optional()
    .notEmpty()
    .withMessage("Summary is required"),

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