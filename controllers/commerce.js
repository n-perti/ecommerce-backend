const commerceModel = require("../models/nosql/commerce");

// Get all commerces
exports.getCommerces = async (req, res) => {
  try {
    const commerces = await commerceModel.find();
    res.json(commerces);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a commerce by CIF
exports.getCommerceByCIF = async (req, res) => {
  try {
    const commerce = await commerceModel.findOne({ cif: req.params.cif });
    res.json(commerce);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Save a new commerce
exports.saveCommerce = async (req, res) => {
  try {
    const commerce = new commerceModel(req.body);
    await commerce.save();
    res.json({ message: "Commerce saved" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update an existing commerce by CIF
exports.updateCommerce = async (req, res) => {
  try {
    await commerceModel.findOneAndUpdate({ cif: req.params.cif }, req.body);
    res.json({ message: "Commerce updated" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete a commerce by CIF
exports.deleteCommerce = async (req, res) => {
  try {
    await commerceModel.findOneAndDelete({ cif: req.params.cif });
    res.json({ message: "Commerce deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
};
