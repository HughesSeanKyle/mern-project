const express = require('express');
const router = express.Router();
const { validationResult, check } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');

const User = require('../../models/User');

// @route GET api/users
// @desc Register user
// @access public (no auth checks yet)
/*
    When this route becomes private then a token will need to be sent along to validate if the client can access this route 
*/
router.post(
	'/user',
	[
		check('name', 'Name is required').not().isEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with the following criteria: 1. Has 8 or more characters. 2. Has atleast 1 uppercase and 1 lowercase letter. 3. Contains atleast 1 number and a special chararcter'
		).matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]?)[A-Za-z\d\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]{8,}$/
		),
	],
	async (req, res) => {
		console.log('req.body', req.body);
		// Pass req object
		const errors = validationResult(req);
		// Handle bad request
		if (!errors.isEmpty()) {
			// Bad req
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			// ** Later -> Register -> get code -> Enter -> then logged in
			// Check if user already exists
			let user = await User.findOne({ email: email });

			if (user) {
				res.status(400).json({ errors: [{ msg: 'User already exists' }] });
			}
			// Get users gravatar
			const avatar = gravatar.url(email, {
				// specify requirements for avatar
				s: '200',
				r: 'pg',
				d: 'mm',
			});

			// Create new instance - must be persisted to db
			user = new User({
				name: name,
				email: email,
				avatar: avatar,
				password: password,
			});

			// Encrypt password (bcrypt)
			// // salt rounds to do hashing with
			const salt = await bcrypt.genSalt(10);

			// // hash password from req.body and save to instance of user
			user.password = await bcrypt.hash(password, salt);
			// Return jsonWebtoken
			// // Reason for jsonWebtoken => When user registers they are logged in right away

			res.send('User registered successfully!');
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);
// router.get('/users', (req, res) => {
// 	res.send('Whatup from the user get route');
// });

module.exports = router;
