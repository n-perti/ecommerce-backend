const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const {
  commerceMiddleware,
  authMiddleware,
} = require("../middlewares/authMiddleware");
const {
  validateGetWebCommercesByCity,
  validateGetWebCommerceByCIF,
  validateCreateWebCommerce,
  validateUpdateWebCommerce,
  validateArchiveOrDeleteWebCommerce,
  validateUploadWebCommerceImage,
  validateCreateReview,
  validateGetWebCommercesByActivity,
} = require("../validators/webCommerce");
const webCommerceController = require("../controllers/webCommerce");
const handleValidator = require("../utils/handleValidator");

/**
 * @swagger
 * tags:
 *   name: WebCommerce
 *   description: WebCommerce management
 */

/**
 * @swagger
 * /api/webCommerce/view/{commerceCIF}:
 *   get:
 *     summary: Get webCommerce by CIF
 *     tags: [WebCommerce]
 *     parameters:
 *       - in: path
 *         name: commerceCIF
 *         schema:
 *           type: string
 *         required: true
 *         description: The CIF of the webCommerce
 *     responses:
 *       200:
 *         description: WebCommerce retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: WebCommerce not found
 */
router.get(
  "/webCommerce/view/:commerceCIF",
  commerceMiddleware,
  validateGetWebCommerceByCIF,
  handleValidator,
  webCommerceController.getWebCommerceByCIF
);

/**
 * @swagger
 * /api/webCommerce/create:
 *   post:
 *     summary: Create a new webCommerce
 *     tags: [WebCommerce]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *               activity:
 *                 type: string
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               text:
 *                 type: array
 *                 items:
 *                   type: string
 *               usersReview:
 *                 type: object
 *                 properties:
 *                   scoring:
 *                     type: number
 *                   totalReviews:
 *                     type: number
 *                   review:
 *                     type: string
 *               commerceCIF:
 *                 type: string
 *     responses:
 *       201:
 *         description: WebCommerce created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/webCommerce/create",
  commerceMiddleware,
  validateCreateWebCommerce,
  handleValidator,
  webCommerceController.createWebCommerce
);

/**
 * @swagger
 * /api/webCommerce/update/{commerceCIF}:
 *   put:
 *     summary: Update a webCommerce by CIF
 *     tags: [WebCommerce]
 *     parameters:
 *       - in: path
 *         name: commerceCIF
 *         schema:
 *           type: string
 *         required: true
 *         description: The CIF of the webCommerce
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *               activity:
 *                 type: string
 *               title:
 *                 type: string
 *               summary:
 *                 type: string
 *               text:
 *                 type: array
 *                 items:
 *                   type: string
 *               isArchived:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: WebCommerce updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: WebCommerce not found
 */
router.put(
  "/webCommerce/update/",
  commerceMiddleware,
  validateUpdateWebCommerce,
  handleValidator,
  webCommerceController.updateWebCommerce
);

/**
 * @swagger
 * /api/webCommerce/{commerceCIF}:
 *   delete:
 *     summary: Archive or delete a webCommerce by CIF
 *     tags: [WebCommerce]
 *     parameters:
 *       - in: path
 *         name: commerceCIF
 *         schema:
 *           type: string
 *         required: true
 *         description: The CIF of the webCommerce
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [archive, delete]
 *         required: true
 *         description: The action to perform (archive or delete)
 *     responses:
 *       200:
 *         description: WebCommerce archived or deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: WebCommerce not found
 */
router.delete(
  "/webCommerce/:commerceCIF",
  commerceMiddleware,
  validateArchiveOrDeleteWebCommerce,
  handleValidator,
  webCommerceController.archiveOrDeleteWebCommerce
);

/**
 * @swagger
 * /api/webCommerce/upload/{commerceCIF}:
 *   patch:
 *     summary: Upload an image for a webCommerce by CIF
 *     tags: [WebCommerce]
 *     parameters:
 *       - in: path
 *         name: commerceCIF
 *         schema:
 *           type: string
 *         required: true
 *         description: The CIF of the webCommerce
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: WebCommerce not found
 */
router.patch(
  "/webCommerce/upload/:commerceCIF",
  commerceMiddleware,
  validateUploadWebCommerceImage,
  handleValidator,
  upload.single("image"),
  webCommerceController.uploadImage
);

/**
 * @swagger
 * /api/webCommerce/all:
 *   get:
 *     summary: Get all webCommerces
 *     tags: [WebCommerce]
 *     responses:
 *       200:
 *         description: WebCommerces retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: WebCommerces not found
 */
router.get("/webCommerce/all", webCommerceController.getAllWebCommerces);

/**
 * @swagger
 * /api/webCommerce/review/{commerceCIF}:
 *   post:
 *     summary: Create a review for a webCommerce
 *     tags: [WebCommerce]
 *     parameters:
 *       - in: path
 *         name: commerceCIF
 *         schema:
 *           type: string
 *         required: true
 *         description: The CIF of the webCommerce
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               review:
 *                 type: string
 *               rating:
 *                 type: number
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: WebCommerce not found
 */
router.post(
  "/webCommerce/review/:commerceCIF",
  authMiddleware,
  validateCreateReview,
  handleValidator,
  webCommerceController.createReview
);

/**
 * @swagger
 * /api/webCommerce/city/{city}:
 *   get:
 *     summary: Get webCommerces by city
 *     tags: [WebCommerce]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the city
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [scoring]
 *         description: (Optional) Sort by scoring
 *     responses:
 *       200:
 *         description: Successful retrieval of webCommerces
 *       500:
 *         description: Internal server error
 */
router.get(
  "/webCommerce/city/:city",
  validateGetWebCommercesByCity,
  handleValidator,
  webCommerceController.getWebCommercesByCity
);

/**
 * @swagger
 * /api/webCommerce/city/{city}/activity/{activity}:
 *   get:
 *     summary: Get webCommerces by city and activity
 *     tags: [WebCommerce]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the city
 *       - in: path
 *         name: activity
 *         required: true
 *         schema:
 *           type: string
 *         description: Activity type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [scoring]
 *         description: (Optional) Sort by scoring
 *     responses:
 *       200:
 *         description: Successful retrieval of webCommerces
 *       500:
 *         description: Internal server error
 */
router.get(
  "/webCommerce/city/:city/activity/:activity",
  validateGetWebCommercesByCity,
  validateGetWebCommercesByActivity,
  handleValidator,
  webCommerceController.getWebCommercesByCityAndActivity
);

/**
 * @swagger
 * /api/webCommerce/activity/{activity}:
 *   get:
 *     summary: Get webCommerces by activity
 *     tags: [WebCommerce]
 *     parameters:
 *       - in: path
 *         name: activity
 *         required: true
 *         schema:
 *           type: string
 *         description: Activity type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [scoring]
 *         description: (Optional) Sort by scoring
 *     responses:
 *       200:
 *         description: Successful retrieval of webCommerces
 *       500:
 *         description: Internal server error
 */
router.get(
  "/webCommerce/activity/:activity",
  validateGetWebCommercesByActivity,
  handleValidator,
  webCommerceController.getWebCommercesByActivity
);

module.exports = router;
