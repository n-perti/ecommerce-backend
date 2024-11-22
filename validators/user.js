// validators/user.js
const { check } = require("express-validator");

const userCreationValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("age").isNumeric().withMessage("Age must be a number"),
  check("city").notEmpty().withMessage("City is required"),
  check("interest").notEmpty().withMessage("Interest is required"),
  check("allowOffers").isBoolean().withMessage("AllowOffers must be a boolean"),
];

const userUpdateValidator = [
  check("name").optional().notEmpty().withMessage("Name is required"),
  check("email").optional().isEmail().withMessage("Valid email is required"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("age").optional().isNumeric().withMessage("Age must be a number"),
  check("city").optional().notEmpty().withMessage("City is required"),
  check("interest").optional().notEmpty().withMessage("Interest is required"),
  check("allowOffers")
    .optional()
    .isBoolean()
    .withMessage("AllowOffers must be a boolean"),
];

const userLoginValidator = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

module.exports = {
  userCreationValidator,
  userUpdateValidator,
  userLoginValidator,
};