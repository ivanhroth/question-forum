const express = require("express");
const { handleValidationErrers, asyncHandler } = require("../utils");
const { check } = require("express-validator");
const { port } = require('../config');
const { requireAuth } = require('../auth');
const router = express.Router();
const { obtainTime } = require('../public/js/get-time')

const db = require('../models');
const { Question, User, Answer } = db;

router.get('/', requireAuth,asyncHandler(async (req, res) => {
    const questions = await Question.findAll({
        include: [{ model: User }],
        order: [['createdAt', 'DESC']]
    });
    // console.log(questions[0].dataValues.id)
    const timeArray = [];
    for (let i = 0; i < questions.length; i++) {
        const time = await questions[i].dataValues.createdAt;
        timeArray[i] = await obtainTime(time)
    }
    console.log(timeArray[0])
    res.render('view-questions', { title: 'Questions', questions, timeArray});
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
    const userId = res.locals.user.id;
    const question = await Question.create({
            title: title,
            message: message,
            userId: userId
        })
    res.redirect(`/questions/${question.id}`)
}));


router.get('/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const question = await Question.findByPk(id);
    const user = await User.findByPk(question.userId);
    const answerSubmitURL = `/questions/${id}/answers`;
    let loggedInAsCreator;
    if (res.locals.authenticated) loggedInAsCreator = (question.userId === res.locals.user.id);
    else loggedInAsCreator = false;
    res.render('question', { title: `Question: ${question.title}`, question, user, answerSubmitURL, loggedInAsCreator })
}));

router.get('/:id(\\d+)/answers', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const answers = await Answer.findAll({
        where: {
            questionId: id
        }
    });
    const users = [];
    for (let i=0; i<answers.length; i++){
        const user = await User.findByPk(answers[i].userId);
        users.push(user);
    }
    res.json({answers, users, currentUserId: res.locals.user.id});
}))

const validateAnswer = [
    check('answerMessage').exists({ checkFalsey: true }).withMessage("Answer body must not be blank.")
]

router.post('/:id(\\d+)/answers', requireAuth, validateAnswer, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { answerMessage } = req.body;
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

router.delete('/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const question = await Question.findByPk(id);
    if(res.locals.user.id !== question.userId) res.send(403);
    try{
        const answers = await Answer.findAll({
            where: {
                questionId: id
            }
        });
        answers.forEach(async answer => {
            await answer.destroy();
        });
    } catch (e){}
    await question.destroy();
    res.send(200);
}));

router.delete('/:questionid(\\d+)/answers/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const id = req.params.id;
    const answer = await Answer.findByPk(id);
    if (res.locals.user.id !== answer.userId) res.send(403);
    await answer.destroy();
    res.send(200);
}))

module.exports = router;
