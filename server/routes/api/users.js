const express = require('express');
const router = express.Router();
const { validationResult, check } = require('express-validator');

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
	(req, res) => {
		console.log('req.body', req.body);
		// Pass req object
		const errors = validationResult(req);
		// Handle bad request
		if (!errors.isEmpty()) {
			// Bad req
			return res.status(400).json({ errors: errors.array() });
		}
		res.send('This is the users post route');
	}
);
// router.get('/users', (req, res) => {
// 	res.send('Whatup from the user get route');
// });

module.exports = router;
