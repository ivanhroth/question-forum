const express = require("express");
const db = require('../models');
const { Question, User, Answer } = db;
const { asyncHandler } = require('./utils');

const router = express.Router();

router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const question = await Question.findByPk(id);
    const user = await User.findByPk(question.userId);
    const answers = await Answer.findAll({
        where: {
            questionId: id
        }
    });
    res.render('question', { title: `Question: ${question.title}`, question, user, answers })
}))

module.exports = router;
