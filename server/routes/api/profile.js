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

// @route POST /profile
// @desc Create or Update user Profile
// @access Private
/*
	This route is private as it requires an authenticated user to create a profile. The jwt token created on signIn will be the access mechanism for the user to utilize this resource. 

	Futhermore, it is this token that provides the user id the Profile model requires to create a relational link between Profile and User via the user.id (Provided by mongo)
*/
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

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body;

		// Build Profile object
		const profileFields = {};
		profileFields.user = req.user.id;
		profileFields.social = {};

		// Assign any completed fields to the profileFields object
		for (const key of Object.keys(req.body)) {
			const keyArray = ['status', 'company', 'website', 'location'];
			keyArray.map((keyItem) => {
				if (key === keyItem) profileFields[key] = req.body[key];
			});
			if (key && key !== 'status') {
				if (key === 'skills') {
					// Split skills by comma and trim values of spaces
					profileFields.skills = skills.split(',').map((skill) => skill.trim());
				} else if (
					key === 'youtube' ||
					'twitter' ||
					'facebook' ||
					'linkedIn' ||
					'instagram'
				) {
					profileFields.social[key] = req.body[key];
				} else {
					profileFields[key] = req.body[key];
				}
			}
		}

		try {
			// Find profile in db based on the AUTHORIZED user accessing this route
			// // id comes from jwt and when decrypted id will be present in decrypted object
			let profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				// update the profile if found
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);

				console.log('Profile from if - update', profile);

				return res.json({
					data: profile,
					location: 'if',
				});
			} else {
				// Create new profile
				profile = new Profile(profileFields);

				await profile.save();
				res.json({
					data: profile,
					location: 'else',
				});
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route GET /profile
// @desc Get all profiles (No auth required as this should be available for all to access)
// @access Public
router.get('/profile', async (req, res) => {
	try {
		// #Note 2
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json({
			data: profiles,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET /profile/user/:user_id
// @desc Get profile by user id
// @access Public
router.get('/profile/user/:user_id', async (req, res) => {
	try {
		// #Note 2
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			// Bad req
			return res.status(400).json({ msg: 'Profile not found' });
		} else {
			return res.status(200).json({
				data: profile,
			});
		}
	} catch (err) {
		console.error(err.message);
		// If error relates to that of an object id
		if ((err.kind = 'ObjectId')) {
			return res.status(400).json({ msg: 'Profile not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route DELETE /profile/user/:user_id
// @desc DELETE profile, user & post
// @access Private
router.delete('/profile', auth, async (req, res) => {
	try {
		//  @todo - remove users posts

		// Remove profile
		// Tip: Inside of a lambda function only these db commands will exist => Once serverless deploys the lamda function it will get its own url/endpoint. The conditions for the routes can then be tweaked even further inside of API gateway.
		await Profile.findOneAndRemove({ user: req.user.id });

		await User.findOneAndRemove({ _id: req.user.id });

		res.json({
			msg: 'Profile and User Deleted',
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route PUT /profile/experience
// @desc Update parts of profile profile
// @access Private

router.put(
	'/profile/experience',
	[
		auth,
		[
			check('title', 'Title is a required field').not().isEmpty(),
			check('company', 'Company is a required field').not().isEmpty(),
			check('from', 'From Date is a required field').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);

		// If there are any errors
		if (!errors.isEmpty) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { title, company, location, from, to, current, description } =
			req.body;

		// e.g short hand for title:title => Below allocated from req.body
		// Creates a new object with the data the user submits
		const newExp = { title, company, location, from, to, current, description };

		try {
			// The persistence of this record will add it's own id within the experience array. Making it easy to update/delete/show this record on the client side
			const profile = await Profile.findOne({ user: req.user.id });

			// unshift => Same as push but adds to front rather than back of array
			// This will ensure the most recent exp is first in the array and older exp is pushed to back of array.
			profile.experience.unshift(newExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route PUT /profile/experience
// @desc Update any experience fields within the arra
// @access Private

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

	#Note 2 
	- const profiles = await Profile.find().populate('user', ['name', 'avatar'])
		- Get all profiles and append these user attributes 
			- 1. name
			- 2. avatar 

*/
