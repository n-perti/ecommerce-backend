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

// Archive or Delete a webCommerce
exports.archiveOrDeleteWebCommerce = async (req, res) => {
  try {
    const { action } = req.query;
    const commerceCIF = req.commerce.cif;

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
    res.status(500).json({ message: "Error in archiveOrDeleteWebCommerce" });
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

// All webcommerces

exports.getAllWebCommerces = async (req, res) => {
  try {
    const webCommerces = await webCommerceModel.find();
    res.json(webCommerces);
  } catch (error) {
    res.status(500).json({
      message: "Error in getAllWebCommerces",
    });
    notifySlack(`Error getting all web commerces: ${error}`);
  }
}

exports.createReview = async (req, res) => {
  try {
    const data = matchedData(req);
    const { review, rating } = data;
    const { commerceCIF } = req.params;

    const webCommerce = await webCommerceModel.findOne({ commerceCIF });
    if (!webCommerce) {
      return res.status(404).json({ message: "Web Commerce not found" });
    }

    const newReview = {
      review,
      rating,
      date: new Date(),
    };
    webCommerce.usersReview.review.push(newReview);

    const totalRatings = webCommerce.usersReview.review.length;
    const totalRatingSum = webCommerce.usersReview.review.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const newAverageRating = totalRatingSum / totalRatings;

    webCommerce.usersReview.scoring = newAverageRating;
    webCommerce.usersReview.totalReviews = totalRatings;

    await webCommerce.save();
    res.json({ message: "Review added", webCommerce });
  } catch (error) {
    res.status(500).json({ message: "Error in createReview" });
    notifySlack(`Error creating review: ${error}`);
  }
};



// Get webCommerces by city
exports.getWebCommercesByCity = async (req, res) => {
  try {
    const data = matchedData(req);
    const { sortBy } = req.query; // Optional sorting by scoring

    let query = webCommerceModel.find({ city: data.city });

    if (sortBy === 'scoring') {
      query = query.sort({ 'usersReview.scoring': -1 });
    }

    const webCommerces = await query.exec();
    res.json(webCommerces);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get webCommerces by city and activity
exports.getWebCommercesByCityAndActivity = async (req, res) => {
  try {
    const data = matchedData(req);
    const { sortBy } = req.query; // Optional sorting by scoring

    let query = webCommerceModel.find({ city: data.city, activity: data.activity });

    if (sortBy === 'scoring') {
      query = query.sort({ 'usersReview.scoring': -1 });
    }

    const webCommerces = await query.exec();
    res.json(webCommerces);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get webCommerces by activity
exports.getWebCommercesByActivity = async (req, res) => {
  try {
    const data = matchedData(req);
    const { sortBy } = req.query; // Optional sorting by scoring

    let query = webCommerceModel.find({ activity: data.activity });

    if (sortBy === 'scoring') {
      query = query.sort({ 'usersReview.scoring': -1 });
    }

    const webCommerces = await query.exec();
    res.json(webCommerces);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

