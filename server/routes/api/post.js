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

			res.status(200).json({
				data: post,
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route GET /post
// @desc Get all posts
// @access private (Users must be logged in to see comments)

router.get('/posts', auth, async (req, res) => {
	try {
		// Sorting by -1 will return the most recent posts
		const posts = await Post.find().sort({ date: -1 });
		res.status(200).json({
			data: posts,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route GET /post/:id
// @desc Get post by id
// @access private (Users must be logged in to see comments)

router.get('/posts/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		res.status(200).json({
			data: post,
		});
	} catch (err) {
		console.error(err.message);
		// If == to object id means it is not a formatted object id
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route DELETE /post/:id
// @desc Delete post by id
// @access private (User must be logged in to delete => This is a user admin log in (The content provider))

router.delete('/posts/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({ msg: 'Post not found' });
		}

		// Match the user id linked to the post with the authenticated user.
		if (post.user.toString() !== req.user.id) {
			// Not authorized
			return res.status(401).json({ msg: 'User not authorized' });
		}

		await post.remove();

		res.status(200).json({
			msg: 'Post removed',
		});
	} catch (err) {
		console.error(err.message);
		// If == to object id means it is not a formatted object id (If not valid obj id)
		if (err.kind === 'ObjectId') {
			return res.status(404).json({ msg: 'Post not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route PUT /post/like/:id
// @desc Like a post
// @access private
router.put('/like/:id', auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Check if the post has already been liked
		/*
			filter is higher order array method
			- 1. Loop through all 'likes'
			- 2. convert the id in the like.user obj to a string 
			- 3. Match it to the AUTHENTICATED user
			- 4. Check if that user does in fact have any likes on respective post 
			- 5. then run if logic 
			- In a nutshell 
				- filter all likes and return only the likes that belong to the AUTHENTICATED user  
		*/
		if (
			post.likes.filter((like) => like.user.toString() == req.user.id).length >
			0
		) {
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
