const express = require('express');
const router = express.Router();

// @route GET api/users
// @desc Test route
// @access public (no auth checks yet)
/*
    When this route becomes private then a token will need to be sent along to validate if the client can access this route 
*/
router.get('/users', (req, res) => {
	res.send('Whatup from the user get route');
});

module.exports = router;
