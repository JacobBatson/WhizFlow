const express = require('express'); // handle routing in express
const router = express.Router(); //difining routes  with mini express app
const User = require('../models/User');
route.post('/', async (req, res) =>{ //define the route
//lpulls data from body request
    const existingUser = await User.findOne({googleID});
    const {googleID, email, name , picture} = req.body
});
MediaSourceHandle.exports = router;

