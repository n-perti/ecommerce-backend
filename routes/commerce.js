const express = require('express');
const router = express.Router();
const commerceController = require('../controllers/commerce');

router.get('/commerces', commerceController.getCommerces);
router.get('/commerces/:cif', commerceController.getCommerceByCIF);
router.post('/commerces', commerceController.saveCommerce);
router.put('/commerces/:cif', commerceController.updateCommerce);
router.delete('/commerces/:cif', commerceController.deleteCommerce);


module.exports = router;