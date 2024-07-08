const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const TodoRouter = require('./routes/TodoRoutes')

const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("MongoDB connected successfully")
})
.catch(err => {
    console.error("Error connecting to MongoDB: ", err)
});

app.use('/', TodoRouter);
app.listen(process.env.PORT, () => {
    console.log('listening on port ' + process.env.PORT)
})