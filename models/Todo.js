const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    task: String,
    completed: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    email: {type: String, required: true}
})

const TodoModel = mongoose.model('todos', TodoSchema);
module.exports = TodoModel;