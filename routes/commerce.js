const express = require('express');
const router = express.Router();
const commerceController = require('../controllers/commerce');

// Route to get all commerces
router.get('/commerces', commerceController.getCommerces);

// Route to get a specific commerce by CIF
router.get('/commerces/:cif', commerceController.getCommerceByCIF);

// Route to save a new commerce
router.post('/commerces', commerceController.saveCommerce);

// Route to update an existing commerce by CIF
router.put('/commerces/:cif', commerceController.updateCommerce);

// Route to delete a commerce by CIF
router.delete('/commerces/:cif', commerceController.deleteCommerce);

module.exports = router;