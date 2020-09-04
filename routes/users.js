const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');

router.get('/sign-up', (req, res) => {
    const user = db.User.build();
    res.render('sign-up', {
        title: 'Register',
        user,
    });
});

module.exports = router;
