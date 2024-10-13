const commerceModel = require("../models/nosql/commerce");

exports.getCommerces = async (req, res) => {
  try {
    const commerces = await commerceModel.find();
    res.json(commerces);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCommerceByCIF = async (req, res) => {
  try {
    const commerce = await commerceModel.findOne({ cif: req.params.cif });
    res.json(commerce);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.saveCommerce = async (req, res) => {
  try {
    const commerce = new commerceModel(req.body);
    await commerce.save();
    res.json({ message: "Commerce saved" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateCommerce = async (req, res) => {
  try {
    await commerceModel.findOneAndUpdate({ cif: req.params.cif }, req.body);
    res.json({ message: "Commerce updated" });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.deleteCommerce = async (req, res) => {
  try {
    await commerceModel.findOneAndDelete({ cif: req.params.cif });
    res.json({ message: "Commerce deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
};
