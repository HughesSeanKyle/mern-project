const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// Models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const mongoose = require('mongoose');

// @route POST /post
// @desc Create a post
// @access private (USer must be logged in to create a post)

router.post(
	'/posts',
	[auth, [check('text', 'Text is required').not().isEmpty()]],
	async (req, res) => {
		console.log('Posts route hit');

		const errors = validationResult(req);

		// If errors array is not empty
		if (!errors.isEmpty()) {
			// Bad request
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			// The user will be logged in and the userId will be in the token
			// User object made available via decrypted JWT using auth middleware
			const user = await User.findById(req.user.id).select('-password');

			// Create new post instance from Post model
			const newPost = new Post({
				text: req.body.text,
				name: user.name,
				avatar: user.avatar,
				user: req.user.id,
			});

			const post = await newPost.save();

			res.json({
				data: post,
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
