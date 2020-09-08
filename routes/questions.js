const express = require("express");
const { handleValidationErrers, asyncHandler } = require("../utils");
const { check } = require("express-validator");

const router = express.Router();

const db = require('../models');
const { Question, User, Answer } = db;



router.get('/', asyncHandler(async (req, res) => {
    const questions = await Question.findAll({
        order: [['createdAt', 'DESC']]
    });
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
    res.redirect('/questions/:id')
}));


router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const question = await Question.findByPk(id);
    const user = await User.findByPk(question.userId);
    const answerSubmitURL = `/questions/${id}/answer`;
    const answers = await Answer.findAll({
        where: {
            questionId: id
        }
    });
    res.render('question', { title: `Question: ${question.title}`, question, user, answers, answerSubmitURL })
}));

router.post('/:id(\\d+)', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { answerMessage } = req.body;
    res.redirect('/');
}));

module.exports = router;
