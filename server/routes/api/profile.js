const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET /profile/me
// @desc get the signed in user profile
// @access pvt route => route accessed via token
router.get('/profile/me', auth, async (req, res) => {
	try {
		// See #Note 1 below
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		);

		if (!profile) {
			return res.status(400).json({ msg: 'There is no profile for this user' });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route Profile /profile
// @desc Create or Update user Profile
// @access Private
router.post(
	'/profile',
	[
		auth,
		[
			check('status', 'Status is required').not().isEmpty(),
			check('skills', 'Skills is required').not().isEmpty(),
		],
	],
	async (req, res) => {
		// Pass over entire req object to validationResult
		const errors = validationResult(req);

		// Check if errs
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		res.send.json({
			data: 'Request success',
		});
	}
);

module.exports = router;

/*
    #Note 1
    - const profile = await Profile.findOne({ user: req.user.id }).populate(
			'user',
			['name', 'avatar']
		);

        - Find the profile which matches the req.user.id 
            - req.user.id 
                - This is the decrypted JWT user id returned from auth 
                - If this user is not returned then this route cannot be accessed  

        - .populate(
			'user',
			['name', 'avatar']
		);
            - Include these fields from the user model when returning the user Profile 

*/
