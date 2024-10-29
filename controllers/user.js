const bcrypt = require("bcryptjs");
const { generateToken, verifyToken } = require("../config/jwt");
const User = require("../models/nosql/users");
const WebCommerce = require("../models/nosql/webCommerce");
const Commerce = require("../models/nosql/commerce");
const { matchedData } = require("express-validator");
const { notifySlack } = require("../utils/slackNotifier");

const registerUser = async (req, res) => {
  const data = matchedData(req);
  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const user = new User({
      ...data,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    res.status(400).send(err.message);
    notifySlack(`Error registering user: ${err}`);
  }
};

const loginUser = async (req, res) => {
  const data = matchedData(req);

  try {
    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(400).send("Email or password is wrong");

    const validPass = await bcrypt.compare(data.password, user.password);
    if (!validPass) return res.status(400).send("Invalid password");

    const token = generateToken({ id: user._id, role: user.role });
    res.header("auth-token", token).send(token);
  } catch (err) {
    res.status(400).send(err.message);
    notifySlack(`Error logging in user: ${err}`);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.user;
  const updates = matchedData(req);

  if (updates.role) return res.status(403).send("Cannot update role");

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    Object.assign(user, updates);
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
    notifySlack(`Error updating user: ${err}`);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).send("User not found");

    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send(err.message);
    notifySlack(`Error deleting user: ${err}`);
  }
};

const getInterestedUsersEmails = async (req, res) => {
  const cif = req.commerce.cif; // Utiliza el CIF desencriptado por el middleware

  try {
    // Buscar el comercio por CIF
    const commerce = await Commerce.findOne({ cif });
    if (!commerce) return res.status(404).send("Commerce not found");

    const commerceId = commerce._id;

    // Buscar la actividad del comercio en webCommerce
    const webCommerce = await WebCommerce.findOne({ commerceCIF: cif });
    if (!webCommerce) return res.status(404).send("WebCommerce not found");

    const commerceActivity = webCommerce.activity;

    // Buscar usuarios interesados en la actividad del comercio
    const users = await User.find({
      allowOffers: true,
      interest: { $in: [commerceActivity] }, // Verificar si la actividad del usuario contiene la actividad del comercio
    }).select("email"); // Seleccionamos solo el campo email

    console.log(users);
    const emails = users.map((user) => user.email);

    res.send(emails);
  } catch (err) {
    res.status(400).send(err.message);
    notifySlack(`Error fetching interested users' emails: ${err}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getInterestedUsersEmails,
};
