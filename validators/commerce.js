const { check, validationResult } = require("express-validator");
const Commerce = require("../models/nosql/commerce"); // Assuming you have a Commerce model

const validateGetCommerceByCIF = [
  check("cif").isString().withMessage("CIF must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const validateSaveCommerce = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Valid email is required"),
  check("cif").isString().notEmpty().withMessage("CIF is required and must be a string"),
  check("address").isString().notEmpty().withMessage("Address is required and must be a string"),
  check("phone").isString().notEmpty().withMessage("Phone is required and must be a string"),
  check("pageId").isNumeric().notEmpty().withMessage("Page ID is required and must be a number"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Check if another commerce with the same CIF exists
    const existingCommerce = await Commerce.findOne({ cif: req.body.cif });
    if (existingCommerce) {
      return res.status(400).json({ errors: [{ msg: "Commerce with this CIF already exists" }] });
    }

    next();
  },
];

const validateUpdateCommerce = [
  check("name").optional().notEmpty().withMessage("Name is required"),
  check("email").optional().isEmail().withMessage("Valid email is required"),
  check("address").optional().isString().notEmpty().withMessage("Address is required and must be a string"),
  check("phone").optional().isString().notEmpty().withMessage("Phone is required and must be a string"),
  check("pageId").optional().isNumeric().notEmpty().withMessage("Page ID is required and must be a number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

const validateDeleteCommerce = [
  check("cif").isString().withMessage("CIF must be a string"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

module.exports = {
  validateGetCommerceByCIF,
  validateSaveCommerce,
  validateUpdateCommerce,
  validateDeleteCommerce,
};
