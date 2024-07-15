const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const TodoRouter = require('./routes/TodoRoutes')
const AuthRouter = require('./routes/AuthRoutes')

const app = express()
  
app.use(cors({
  origin: [process.env.UI_URL]
}));
app.use(express.json())
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("MongoDB connected successfully")
    // Routes
    app.use('/', TodoRouter);
    app.use('/auth', AuthRouter);
    
    // Server
    app.listen(process.env.PORT, () => {
        console.log('listening on port ' + process.env.PORT)
    })
})
.catch(err => {
    console.error("Error connecting to MongoDB: ", err)
});
