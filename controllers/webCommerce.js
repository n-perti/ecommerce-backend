const webCommerceModel = require("../models/nosql/webCommerce");
const path = require("path");
const { matchedData } = require("express-validator");
const { notifySlack } = require("../utils/slackNotifier");

/*
Visit website by id
Create a new website (with model data)
Update a website
Archive a website (logical delete)
Delete a website (physical delete)
*/

exports.getWebCommerceByCIF = async (req, res) => {
  try {
    const webCommerce = await webCommerceModel.findOne({
      commerceCIF: req.commerce.cif,
    });
    if (!webCommerce) {
      return res.status(404).json({ message: "Web Commerce not found" });
    }
    res.json(webCommerce);
  } catch (error) {
    res.status
      .status(500)
      .json({ message: "Error in getWebCommerceByCIF", error });
    
    notifySlack(`Error getting web commerce by CIF: ${error}`);
  }
};


exports.createWebCommerce = async (req, res) => {
  try {
    const data = matchedData(req);
    const commerceCIF = req.commerce.cif;

    if (data.commerceCIF !== commerceCIF) {
      return res.status(403).send("CIF does not match the authorized commerce");
    }

    const webCommerce = new webCommerceModel(data);
    await webCommerce.save();
    res.json({ message: "WebCommerce created", webCommerce });
  } catch (error) {
    res.status(500).send(error);
    notifySlack(`Error saving web commerce: ${error}`);
  }
};

// Update a website

exports.updateWebCommerce = async (req, res) => {
  try {
    const updatedWebCommerce = await webCommerceModel.findOneAndUpdate(
      { commerceCIF: req.commerce.cif },
      req.body,
      { new: true }
    );
    if (!updatedWebCommerce) {
      return res.status(404).json({ message: "Web Commerce not found" });
    }
    res.json(updatedWebCommerce);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in updateWebCommerce",
    })
    notifySlack(`Error updating web commerce: ${error}`);
  }
};

// Archive a website (logical delete) or Delete a website (physical delete)

exports.archiveOrDeleteWebCommerce = async (req, res) => {
  try {
    const { action } = req.query;

    const webCommerce = await webCommerceModel.findOne({
      commerceCIF: req.commerce.cif,
    });
    if (!webCommerce) {
      return res.status(404).json({ message: "Web Commerce not found" });
    }

    if (action === "archive") {
      await webCommerceModel.findOneAndUpdate(
        { commerceCIF: req.commerce.cif },
        { isArchived: true },
        { new: true }
      );
      res.json({ message: "WebCommerce archived" });
    } else if (action === "delete") {
      await webCommerceModel.findOneAndDelete({
        commerceCIF: req.commerce.cif,
      });
      res.json({ message: "WebCommerce deleted" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).send(error);
    notifySlack(`Error archiving or deleting web commerce: ${error}`);
  }
};

// Upload a website image

exports.uploadImage = async (req, res) => {
  try {
    const imageUrl = path.join("/storage", req.file.filename);

    console.log(`Uploading image for commerceCIF: ${req.commerce.cif}`);
    console.log(`Image URL: ${imageUrl}`);

    const webCommerce = await webCommerceModel.findOneAndUpdate(
      { commerceCIF: req.commerce.cif },
      { $push: { images: imageUrl } },
      { new: true }
    );
    res.json(webCommerce);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in uploadImage",
    });
    notifySlack(`Error uploading image: ${error}`);
  }
};
