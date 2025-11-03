const usercontroller = require('../controllers/usercontroller');
const usermodel = require('../models/User');
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     description: Creates a new user in the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: karthik
 *               email:
 *                 type: string
 *                 example: karthik@gmail.com
 *               password:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post('/create', usercontroller.createuser);
/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     description: Returns a list of all users
 *     responses:
 *       200:
 *         description: Successfully fetched users
 *       500:
 *         description: Internal server error
 */

router.get("/all", usercontroller.getusers);
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     description: Retrieve a single user using their unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User found successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", usercontroller.getuser);
/**
 * @swagger
 * /user/update/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     description: Update user details by user ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newname
 *               email:
 *                 type: string
 *                 example: newemail@gmail.com
 *               password:
 *                 type: string
 *                 example: newpassword
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already in use
 *       500:
 *         description: Internal server error
 */
router.put("/update/:id", usercontroller.updateuser);
/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     description: Delete a user by their unique ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.delete("/delete/:id", usercontroller.deleteuser);


module.exports = router;
