const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AuthSchema = new mongoose.Schema({
    email: {type: 'String', required: true, unique: true},
    password: {type: 'String', required: true}
})

AuthSchema.pre('save', async function(next) {
    const user = this
    if(!user.isModified('password')) {
        return next()
    }
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedPassword
        next()
    } catch (err) {
        next(err)
    }
})

const AuthModel = mongoose.model('auth', AuthSchema);
module.exports = AuthModel;