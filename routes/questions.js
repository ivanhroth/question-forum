const express = require("express");
const { handleValidationErrers, asyncHandler } = require("../utils");
const { check } = require("express-validator");
const { port } = require('../config');

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
    const question = Question.build();
    res.render('question-form', {
        title: 'Question Form',
        question
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
    res.render('question', { title: `Question: ${question.title}`, question, user, answerSubmitURL })
}));

router.get('/:id(\\d+)/answers', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const answers = await Answer.findAll({
        where: {
            questionId: id
        }
    });
    console.log(answers);
    const answerList = [];
    await answers.forEach(async answer => {
        const user = await User.findByPk(answer.userId);
        answerList.push({
            message: answer.message,
            user
        })
    });
    console.log(answerList);
    res.json({ answers: answerList });
}))

const validateAnswer = [
    check('answerMessage').exists({ checkFalsey: true }).withMessage("Answer body must not be blank.")
]

router.post('/:id(\\d+)/answer', validateAnswer, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { answerMessage } = req.body;
    const loggedIn = res.locals.authenticated;
    if (loggedIn){
        const userId = res.locals.user.id;
        await Answer.create({
            questionId: id,
            userId,
            message: answerMessage
        });
        res.redirect(`/questions/${id}`); // might change this later to do some kind of fancy AJAX thing but this (which is basically just refreshing the page) should work for now
    }
    else res.redirect(`http://localhost:${port}/users/login`);
}));

module.exports = router;
