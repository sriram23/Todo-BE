const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require('node-cron');
require("dotenv").config();

const TodoRouter = require("./routes/TodoRoutes");
const AuthRouter = require("./routes/AuthRoutes");
const CronRouter = require("./routes/cronRouter");


const app = express();

app.use(
  cors({
    origin: [process.env.UI_URL, "http://localhost:1234"],
  })
);
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    // Routes
    app.use("/", TodoRouter);
    app.use("/auth", AuthRouter);
    app.use("/", CronRouter);

    app.listen(process.env.PORT, () => {
      console.log("listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });
