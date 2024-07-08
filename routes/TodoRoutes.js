const express = require('express');
const router = express.Router();
const TodoModel = require('../models/Todo')

router.post('/add', (req, res) => {
    const task = req.body.task
    TodoModel.create({
        task: task
    }).then(result => res.json(result))
    .catch(err => {res.json(err)})
})

router.get('/get', (req, res) => {
    TodoModel.find().then(result => res.json(result)).catch(err => {res.json(err)})
})

router.put('/complete/:id', (req, res) => {
    const { id } = req.params;
    const completed = req.body.completed;

    TodoModel.findByIdAndUpdate(id, { completed }, { new: true })
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

router.put('/delete/:id', (req, res) => {
    const { id } = req.params;
    const deleted = req.body.deleted;

    TodoModel.findByIdAndUpdate(id, { deleted }, { new: true })
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

module.exports = router