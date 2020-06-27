const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); //validator
const Users = require('../models/Users'); //bring in Users model
const bcrypt = require('bcryptjs'); //to encrypt the user

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
	'/',
	// Validator
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// Validator

		const { name, email, password } = req.body; //destructuring request

		try {
			// check if user already exists
			let user = await Users.findOne({ email });
			if (user) {
				return res.status(400).json({ errors: [ { msg: 'User already exists' } ] });
			}
			// check if user already exists

			//encrypting the user before saving user into the DB
			const salt = await bcrypt.genSalt(10); //creating a salt
			const hashedPassword = await bcrypt.hash(password, salt); //hashing the password

			// saving User into the database
			const newItem = new Users({
				name: name,
				password: hashedPassword,
				email: email
			});
			const item = await newItem.save();
			res.json(item);
			// saving User into the database
		} catch (err) {
			console.error(err.message);
			res.status(500).send({ message: 'failed to Post' });
		}
	}
);

// @route GET /api/users
// @ desc get all users
// @access Public
router.get('/', async (req, res) => {
	try {
		const item = await Users.find();
		res.json(item);
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ message: 'failed to Post' });
	}
});

// @route DELETE /api/users
// @ desc delete  user
// Delete
router.delete('/:id', async (req, res) => {
	try {
		const deletedItem = await Users.findById(req.params.id);
		await deletedItem.remove();
		res.json({ msg: 'Item removed', item: deletedItem });
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ message: 'invalid ID' });
	}
});

// @route Patch /api/users
// @ desc update user
// Update
router.patch('/:id', async (req, res) => {
	try {
		const updatedItem = await Users.updateOne(
			{ _id: req.params.id },
			{
				$set: {
					name: req.body.name
				}
			}
		);
		res.json({ msg: 'Item updated', item: updatedItem });
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ message: 'invalid ID' });
	}
});
module.exports = router;
