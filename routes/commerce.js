const express = require("express");
const router = express.Router();
const commerceController = require("../controllers/commerce");
const {
  validateGetCommerceByCIF,
  validateSaveCommerce,
  validateUpdateCommerce,
  validateDeleteCommerce,
} = require("../validators/commerce");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Commerce
 *   description: Commerce management
 */


/**
 * @swagger
 * /commerces/view-all:
 *   get:
 *     summary: View all commerces
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of commerces
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/commerces/view-all",
  authMiddleware,
  adminMiddleware,
  commerceController.getCommerces
);

/**
 * @swagger
 * /commerces/view/{cif}:
 *   get:
 *     summary: View a commerce by CIF
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cif
 *         schema:
 *           type: string
 *         required: true
 *         description: The CIF of the commerce
 *     responses:
 *       200:
 *         description: A commerce object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Commerce not found
 */
router.get(
  "/commerces/view/:cif",
  authMiddleware,
  adminMiddleware,
  validateGetCommerceByCIF,
  commerceController.getCommerceByCIF
);

/**
 * @swagger
 * /commerces/create:
 *   post:
 *     summary: Create a new commerce
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - cif
 *               - address
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               cif:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commerce created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  "/commerces/create/",
  authMiddleware,
  adminMiddleware,
  validateSaveCommerce,
  commerceController.saveCommerce
);

/**
 * @swagger
 * /commerces/update/{cif}:
 *   put:
 *     summary: Update a commerce by CIF
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cif
 *         schema:
 *           type: string
 *         required: true
 *         description: The CIF of the commerce
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commerce updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Commerce not found
 */
router.put(
  "/commerces/update/:cif",
  authMiddleware,
  adminMiddleware,
  validateUpdateCommerce,
  commerceController.updateCommerce
);

/**
 * @swagger
 * /commerces/delete/{cif}:
 *   delete:
 *     summary: Delete a commerce by CIF
 *     tags: [Commerce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cif
 *         schema:
 *           type: string
 *         required: true
 *         description: The CIF of the commerce
 *     responses:
 *       200:
 *         description: Commerce deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Commerce not found
 */
router.delete(
  "/commerces/delete/:cif",
  authMiddleware,
  adminMiddleware,
  validateDeleteCommerce,
  commerceController.deleteCommerce
);

module.exports = router;
