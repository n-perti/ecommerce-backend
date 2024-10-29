const { check, validationResult } = require("express-validator");
const User = require("../models/nosql/users"); // Make sure to adjust the path to your User model

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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
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
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const userLoginValidator = [
  check("email").isEmail().withMessage("Valid email is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Email does not exist" }] });
    }

    next();
  },
];

module.exports = { userCreationValidator, userUpdateValidator, userLoginValidator};
