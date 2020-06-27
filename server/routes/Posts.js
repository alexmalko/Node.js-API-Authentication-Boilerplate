const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); //validator
const Posts = require('../models/Posts'); //bring in Users model
const bcrypt = require('bcryptjs'); //to encrypt the user
const auth = require('../middleware/auth'); //brining in custom middleware

// @route GET /api/posts
// @ desc get posts
// @access Public
router.get('/', async (req, res) => {
	try {
		const item = await Posts.find();
		res.json(item);
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ message: 'failed to Post' });
	}
});

// @route POST /api/posts
// @ desc post posts with Validation check & hased user
// Create
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
			let user = await Posts.findOne({ email });
			if (user) {
				return res.status(400).json({ errors: [ { msg: 'User already exists' } ] });
			}
			// check if user already exists

			//encrypting the user before saving user into the DB
			const salt = await bcrypt.genSalt(10); //creating a salt
			const hashedPassword = await bcrypt.hash(password, salt); //hashing the password

			// saving User into the database
			const newItem = new Posts({
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

// @route DELETE /api/posts
// @ desc delete  posts
// Delete
router.delete('/:id', async (req, res) => {
	try {
		const deletedItem = await Posts.findById(req.params.id);
		await deletedItem.remove();
		res.json({ msg: 'Item removed', item: deletedItem });
	} catch (err) {
		console.error(err.message);
		res.status(500).send({ message: 'invalid ID' });
	}
});

// @route Patch /api/posts
// @ desc update posts
// Update
router.patch('/:id', async (req, res) => {
	try {
		const updatedItem = await Posts.updateOne(
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
