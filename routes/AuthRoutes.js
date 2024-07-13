const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const AuthModel = require('../models/AuthModel')

router.post('/login', async (req, res, next) => {
    const {email, password} = req.body
    let existingUser
    try {
        existingUser = await AuthModel.findOne({email: email})
        if(!existingUser) {
            return res.status(401).json({error: 'User not found'})
        }
        const isValidPassword = await bcrypt.compare(password, existingUser.password)
        if(!isValidPassword) {
            return res.status(401).json({error: 'Invalid email or password'})
        }
        // If the user already exists and the credentials are valid
        try {
            token = jwt.sign({
                email: existingUser.email
            }, process.env.SECRET_KEY, {expiresIn: '1h'})
        } catch (e) {
            console.error(e)
            return next(e)
        }
        return res.status(200).json({token: token, email: existingUser.email})
    } catch (err) {
        return next(err)
    }
})

router.post('/signup', async (req, res, next) => {
    const {email, password} = req.body
    try {
        const existingUser = await AuthModel.findOne({email: email})
        if (existingUser) {
            return res.status(400).json({error: 'User already exists'})
        }
        AuthModel.create({email: email, password: password}).then(result => {
            res.status(200).json({message: "User created for "+result.email})
        })
    } catch (err) {
        next(err)
    }
})
module.exports = router