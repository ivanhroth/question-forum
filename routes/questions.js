const express = require("express");
const { check } = require("express-validator");
const { handleValidationErrers, asyncHandler } = require("../utils");

const router = express.Router();

const db = require('../models');
const { Question } = db;
console.log(Question)

router.get('/', asyncHandler(async (req, res) => {
    const questions = await Question.findall();
    res.render('view-questions', { title: 'Questions', questions});
}));

router.get('/ask', asyncHandler(async (req, res) => {
    res.render('question-form', {
        title: 'Question Form'
    })
}))

const validateQuestion = [
    check("title")
        .exists({ checkFalsey: true })
        .withMessage("Title cannot be empty.")
        .isLength({ max: 280 })
        .withMessage("Title can only be 280 characters."),
    check("message")
        .exists({ checkFalsey: true })
        .withMessage("Message cannot be empty.")
]

router.post('/ask', validateQuestion, asyncHandler(async (req, res) => {
    const { title, message } = req.body
    const question = await Question.create({
        title: title,
        message: message
    })
    res.redirect('/')
}))

module.exports = router;
