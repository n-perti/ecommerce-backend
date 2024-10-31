const express = require("express");
const router = express.Router();
const {
  userCreationValidator,
  userUpdateValidator,
  userLoginValidator
} = require("../validators/user");
const { authMiddleware, commerceMiddleware } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getInterestedUsersEmails
} = require("../controllers/user");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
router.post("/users/register", userCreationValidator, registerUser);


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid email or password
 */
router.post("/users/login", userLoginValidator, loginUser);


/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               age:
 *                 type: number
 *               city:
 *                 type: string
 *               interest:
 *                 type: string
 *               allowOffers:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Cannot update role
 *       404:
 *         description: User not found
 */
router.put("/users/update", authMiddleware, userUpdateValidator, updateUser);


/**
 * @swagger
 * /users/delete:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.delete("/users/delete", authMiddleware, deleteUser);


/**
 * @swagger
 *  /users/interest:
 *    get:
 *      summary: Get emails of interested users
 *      description: Returns a list of emails of users interested in the commerce's activity.
 *      tags:
 *        - Users
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        '200':
 *          description: A list of user emails
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  type: string
 *        '400':
 *          description: Bad Request
 *        '401':
 *          description: Unauthorized
 *        '404':
 *          description: Not Found
 */
router.get("/users/interest", commerceMiddleware, getInterestedUsersEmails);

module.exports = router;
