const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const { asyncHandler, csrfProtection } = require('./utils');
const { loginUser, logoutUser } = require('../auth');
const { check, validationResult } = require("express-validator");

router.get('/sign-up', csrfProtection, (req, res) => {
    const user = db.User.build();
    res.render('sign-up', {
        title: 'Register',
        user,
        csrfToken: req.csrfToken(),
    });
});

const userValidators = [
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for username'),
    check('email')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Email Address')
      .isLength({ max: 255 })
      .withMessage('Email Address must not be more than 255 characters long')
      .isEmail()
      .withMessage('Email Address is not a valid email')
      .custom((value) => {
        return db.User.findOne({ where: { email: value } })
          .then((user) => {
            if (user) {
              return Promise.reject('The provided Email Address is already in use by another account');
            }
          });
      }),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Password')
      .isLength({ max: 50 })
      .withMessage('Password must not be more than 50 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
      .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
    check('confirmPassword')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Confirm Password')
      .isLength({ max: 50 })
      .withMessage('Confirm Password must not be more than 50 characters long')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirm Password does not match Password');
        }
        return true;
      }),
  ];

router.post('/sign-up', userValidators, csrfProtection,
asyncHandler(async (req, res) => {
    const {
        email,
        username,
        password,
      } = req.body;
  
      const user = db.User.build({
        email,
        username,
      });
  
      const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashedPassword = hashedPassword;
      await user.save();
      loginUser(req, res, user);
      res.redirect('/');
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render('sign-up', {
        title: 'Register',
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  }));

  router.get('/login', csrfProtection, (req, res) => {
    res.render('login', {
      title: 'Login',
      csrfToken: req.csrfToken(),
    });
  });

  const loginValidators = [
    check('username')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Email Address!'),
    check('password')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a value for Password!'),
  ];

  router.post('/login', loginValidators, csrfProtection,
  asyncHandler(async (req, res) => {
    const {
      username,
      password,
    } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      // Attempt to get the user by their email address.
      const user = await db.User.findOne({ where: { username } });

      if (user !== null) {
        // If the user exists then compare their password
        // to the provided password.
        const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

        if (passwordMatch) {
          // If the password hashes match, then login the user
          // and redirect them to the default route.
          loginUser(req, res, user);
          return res.redirect('/');
        }
      }

      // Otherwise display an error message to the user.
      errors.push('Login failed for the provided username and password');
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render('login', {
      title: 'Login',
      username,
      errors,
      csrfToken: req.csrfToken(),
    });
  }));

module.exports = router;
