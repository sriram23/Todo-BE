const express = require('express');
const router = express.Router();
const TodoModel = require('../models/Todo');
const jwt = require('jsonwebtoken');

router.post('/add', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({error: 'Unauthorized: missing token'});
    }
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        if(decodedToken) {
            const task = req.body.task
            TodoModel.create({
                task: task
            }).then(result => res.json(result))
            .catch(err => {res.json(err)})
        } else {
            return res.status(401).json({error: 'Unauthorized: Unknown token'})
        }
        
    } catch(err) {
        return next(err)
    }
    
})

router.get('/get', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({error: 'Unauthorized: missing token'});
    }
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        if(decodedToken) {
            TodoModel.find().then(result => res.json(result)).catch(err => {res.json(err)})
        } else {
            return res.status(401).json({error: 'Unauthorized: Unknown token'})
        }
        
    } catch(err) {
        return next(err)
    }
})

router.put('/complete/:id', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({error: 'Unauthorized: missing token'});
    }
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        if(decodedToken) {
            const { id } = req.params;
            const completed = req.body.completed;

            TodoModel.findByIdAndUpdate(id, { completed }, { new: true })
                .then(result => res.json(result))
                .catch(err => res.json(err));
        } else {
            return res.status(401).json({error: 'Unauthorized: Unknown token'})
        }
        
    } catch(err) {
        return next(err)
    }
});

router.put('/delete/:id', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({error: 'Unauthorized: missing token'});
    }
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        if(decodedToken) {
            const { id } = req.params;
            const deleted = req.body.deleted;

            TodoModel.findByIdAndUpdate(id, { deleted }, { new: true })
                .then(result => res.json(result))
                .catch(err => res.json(err));
        } else {
            return res.status(401).json({error: 'Unauthorized: Unknown token'})
        }
        
    } catch(err) {
        return next(err)
    }
});

module.exports = router