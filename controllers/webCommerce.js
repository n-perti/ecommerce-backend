const webCommerceModel = require("../models/nosql/webCommerce");
const path = require("path");

/*
Visit website by id
Create a new website (with model data)
Update a website
Archive a website (logical delete)
Delete a website (physical delete)
*/

// Visit website by commerceCIF

exports.getWebCommerce = async (req, res) => {
  try {
    const webCommerce = await webCommerceModel.findOne({
      commerceCIF: req.params.commerceCIF,
    });
    if (!webCommerce) {
      return res.status(404).json({ message: "Web Commerce not found" });
    }
    res.json(webCommerce);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in getWebCommerce",
    });
  }
};

// Create a new website (with model data)

exports.createWebCommerce = async (req, res) => {
  try {
    const webCommerce = await webCommerceModel.create(req.body);
    res.json(webCommerce);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in createWebCommerce",
    });
  }
};

// Update a website

exports.updateWebCommerce = async (req, res) => {
  try {
    const updatedWebCommerce = await webCommerceModel.findOneAndUpdate(
      { commerceCIF: req.params.commerceCIF },
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
    });
  }
};

// Archive a website (logical delete) or Delete a website (physical delete)

exports.archiveOrDeleteWebCommerce = async (req, res) => {
  try {
    const { commerceCIF } = req.params;
    const { action } = req.query;

    const webCommerce = await webCommerceModel.findOne({ commerceCIF });
    if (!webCommerce) {
      return res.status(404).json({ message: "Web Commerce not found" });
    }

    if (action === "archive") {
      await webCommerceModel.findOneAndUpdate(
        { commerceCIF },
        { isArchived: true },
        { new: true }
      );
      res.json({ message: "WebCommerce archived" });

    } else if (action === "delete") {
      await webCommerceModel.findOneAndDelete({ commerceCIF });
      res.json({ message: "WebCommerce deleted" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Upload a website image

exports.uploadImage = async (req, res) => {
  try {
    const { commerceCIF } = req.params;
    const imageUrl = path.join('/storage', req.file.filename);

    console.log(`Uploading image for commerceCIF: ${commerceCIF}`);
    console.log(`Image URL: ${imageUrl}`);

    const webCommerce = await webCommerceModel.findOneAndUpdate(
      { commerceCIF },
      { $push: { images: imageUrl } },
      { new: true }
    );

    if (!webCommerce) {
      console.log('WebCommerce not found');
      return res.status(404).json({ message: 'WebCommerce not found' });
    }

    console.log('Image uploaded successfully');
    res.json({ message: 'Image uploaded successfully', webCommerce });
  } catch (error) {
    console.error(`Error uploading image: ${error.message}`);
    res.status(500).send(error);
  }
};