const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const TodoRouter = require('./routes/TodoRoutes')
const AuthRouter = require('./routes/AuthRoutes')

const app = express()
const corsOptions = {
    origin: function (origin, callback) {
      if (origin === process.env.UI_URL) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  };
  
app.use(cors(corsOptions));
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
