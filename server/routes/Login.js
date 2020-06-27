const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator'); //validator
const User = require('../models/Users'); //bring in Users model
const bcrypt = require('bcryptjs'); //to encrypt the user
const jwt = require('jsonwebtoken'); //Jason Web Token for auth
const auth = require('../middleware/auth'); //brining in custom middleware

// @route POST /api/login
// @ desc Login user with Validation check & hased user
// Create
router.post(
	'/',
	// Validator
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists()
		//
	],
	// Validator
	async (req, res) => {
		// Validator error
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// Validator erros

		const { name, email, password } = req.body; //destructuring request

		try {
			// check if user already exists
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' } ] });
			}
			// check if user already exists

			//checking is the emails match
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [ { msg: 'Invalid Credentials' } ] });
			}
			//checking is the emails match

			// res.send('success');

			//generating JWT for auth
			const payload = {
				user: {
					id: user.id
				}
			};

			const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: '5 days' });
			res.header('auth-token', token).send(token);
			//generating JWT for auth
		} catch (err) {
			console.error(err.message);
			res.status(500).send({ message: 'failed to Post' });
		}
	}
);

// @route GET /api/login/secret
// @ desc Example of the private route
// @access Private
router.get('/secret', auth, (req, res) => {
	res.send(req.user);
});

module.exports = router;
