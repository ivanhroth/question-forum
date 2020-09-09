const express = require("express");
const { handleValidationErrers, asyncHandler } = require("../utils");
const { check } = require("express-validator");
const { port } = require('../config');
const { requireAuth } = require('../auth');
const router = express.Router();

const db = require('../models');
const { Question, User, Answer } = db;



router.get('/', requireAuth,asyncHandler(async (req, res) => {
    const questions = await Question.findAll({
        order: [['createdAt', 'DESC']]
    });
    res.render('view-questions', { title: 'Questions', questions});
}));

router.get('/ask', requireAuth, asyncHandler(async (req, res) => {
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

router.post('/ask', requireAuth, validateQuestion, asyncHandler(async (req, res) => {
    const { title, message } = req.body
    const question = await Question.create({
        title: title,
        message: message
    })
    res.redirect('/questions/:id')
}));


router.get('/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
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
    const users = answers.map(async answer => {
        let user;
        User.findByPk(answer.userId).then(u => user = u);
        return user;
    });
    console.log(users);
    res.json({answers, users});
}))

const validateAnswer = [
    check('answerMessage').exists({ checkFalsey: true }).withMessage("Answer body must not be blank.")
]

router.post('/:id(\\d+)/answer', requireAuth, validateAnswer, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { answerMessage } = req.body;
    console.log(req.body);
    const loggedIn = res.locals.authenticated;
    if (loggedIn){
        const userId = res.locals.user.id;
        try {
            await Answer.create({
                questionId: id,
                userId,
                message: answerMessage
            });
        } catch (e){
            console.log(e);
        }
        res.redirect(`/questions/${id}`); // might change this later to do some kind of fancy AJAX thing but this (which is basically just refreshing the page) should work for now
    }
    else res.redirect(`http://localhost:${port}/users/login`);
}));

module.exports = router;
