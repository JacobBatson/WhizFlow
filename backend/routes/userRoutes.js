const express = require('express'); // handle routing in express
const router = express.Router(); // defining routes with mini express app
const User = require('../models/User');

router.post('/', async (req, res) => { // define the route
    // pulls data from body request
    const { googleId, email, name, picture } = req.body;
    try {
        const existingUser = await User.findOne({ googleId });
        let user;
        if (existingUser) {
            user = existingUser;
        } else {
            user = new User({ googleId, email, name, picture });
            await user.save();
        }
        res.status(200).json({ message: 'User saved', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

