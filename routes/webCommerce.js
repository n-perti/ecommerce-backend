const express = require('express');
const router = express.Router();
const webCommerceController = require('../controllers/webCommerce');
const { validateGetWebCommerceByCIF, validateCreateWebCommerce, validateUpdateWebCommerce, validateArchiveOrDeleteWebCommerce, validateUploadWebCommerceImage} = require('../validators/webCommerce');
const handleValidator = require('../utils/handleValidator');
const upload = require('../middlewares/uploadMiddleware');


// Visit website by commerceCIF

router.get('/webCommerce/:commerceCIF', validateGetWebCommerceByCIF, handleValidator, webCommerceController.getWebCommerce);

// Create a new website (with model data)

router.post('/webCommerce', validateCreateWebCommerce, handleValidator, webCommerceController.createWebCommerce);

// Update a website

router.put('/webCommerce/:commerceCIF', validateUpdateWebCommerce, handleValidator, webCommerceController.updateWebCommerce);

// Archive a website (logical delete)

router.delete('/webCommerce/:commerceCIF', validateArchiveOrDeleteWebCommerce, handleValidator, webCommerceController.archiveOrDeleteWebCommerce);

// Upload a website image

router.patch('/webCommerce/:commerceCIF/upload',validateUploadWebCommerceImage, handleValidator, upload.single('image'), webCommerceController.uploadImage);

module.exports = router;