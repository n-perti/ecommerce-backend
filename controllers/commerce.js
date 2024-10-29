const commerceModel = require("../models/nosql/commerce");
const { generateToken } = require("../config/jwt");
const { matchedData } = require("express-validator");
const { notifySlack } = require("../utils/slackNotifier");

// Get all commerces
exports.getCommerces = async (req, res) => {
  try {
    const commerces = await commerceModel.find();
    res.json(commerces);
  } catch (error) {
    res.status(500).send(error);
    notifySlack(`Error getting commerces: ${error}`);
  }
};

// Get a commerce by CIF
exports.getCommerceByCIF = async (req, res) => {
  try {
    const data = matchedData(req);
    const commerce = await commerceModel.findOne({ cif: data.cif });

    const token = generateToken({ cif: commerce.cif });
    // Assign the token to the commerce
    commerce.token = token;
    await commerce.save();
    
    res.json(commerce);
  } catch (error) {
    res.status(500).send(error);
    notifySlack(`Error getting commerce by CIF: ${error}`);
  }
};

// Save a new commerce
exports.saveCommerce = async (req, res) => {
  try {
    const data = matchedData(req);
    console.log(data);
    const commerce = new commerceModel(data);
    // Generate a JWT token using the CIF
    const token = generateToken({ cif: commerce.cif });
    // Assign the token to the commerce
    commerce.token = token;
    await commerce.save();
    res.json({ message: "Commerce saved", token });
  } catch (error) {
    res.status(500).send(error);
    notifySlack(`Error saving commerce: ${error}`);
  }
};

// Update an existing commerce by CIF
exports.updateCommerce = async (req, res) => {
  const updates = matchedData(req);

  if (updates.cif) return res.status(403).send("Cannot update CIF");

  try {
    const commerce = await commerceModel.findOne({ cif: req.params.cif });
    if (!commerce) return res.status(404).send("Commerce not found");

    Object.assign(commerce, updates);
    await commerce.save();
    res.json({ message: "Commerce updated", commerce });
  } catch (error) {
    res.status(400).send(error.message);
    notifySlack(`Error updating commerce: ${error}`);
  }
};

// Delete a commerce by CIF
exports.deleteCommerce = async (req, res) => {
  try {
    const data = matchedData(req);
    await commerceModel.findOneAndDelete({ cif: data.cif });
    res.json({ message: "Commerce deleted" });
  } catch (error) {
    res.status(500).send(error);
    notifySlack(`Error deleting commerce: ${error}`);
  }
};
