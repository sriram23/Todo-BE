const express = require('express');
const router = express.Router();
const TodoModel = require('../models/Todo');
const jwt = require('jsonwebtoken');

// Adds new tasks to the specified user
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
                task: task,
                email: decodedToken.email
            }).then(result => res.json(result))
            .catch(err => {res.json(err)})
        } else {
            return res.status(401).json({error: 'Unauthorized: Unknown token'})
        }
        
    } catch(err) {
        const status = err.status || 500
        return res.status(status).json({error:"Unauthorized: " + err.message})
    }
    
})

// Gets the list of tasks for the current user
router.get('/get', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({error: 'Unauthorized: missing token'});
    }
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        console.log("Decoded token: ",decodedToken)
        if(decodedToken) {
            TodoModel.find({email: decodedToken.email}).then(result => res.json(result)).catch(err => {res.json(err)})
        } else {
            return res.status(401).json({error: 'Unauthorized: Unknown token'})
        }
        
    } catch(err) {
        const status = err.status || 500
        return res.status(status).json({error:"Unauthorized: " + err.message})
    }
})

// Marks the specified task as completed
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
        const status = err.status || 500
        return res.status(status).json({error:"Unauthorized: " + err.message})
    }
});

// Marks the specified task as deleted
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
        const status = err.status || 500
        return res.status(status).json({error:"Unauthorized: " + err.message})
    }
});

module.exports = router