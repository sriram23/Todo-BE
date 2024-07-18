const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require('node-cron');
const nodemailer = require("nodemailer");
require("dotenv").config();

const TodoRouter = require("./routes/TodoRoutes");
const AuthRouter = require("./routes/AuthRoutes");

const TodoModel = require("./models/Todo");
const AuthModel = require("./models/AuthModel");

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

    // Cron job for email reports
    const generateReportHtml = async () => {
      const totalTodos = await TodoModel.countDocuments();
      const totalDeletedTodos = await TodoModel.countDocuments({
        deleted: true,
      });
      const totalUsers = await AuthModel.countDocuments();

      const html = `
        <html>
          <head>
            <style>
                body { background: blue, color: white}
                h1 {font-weight: bold }
            </style>
          </head>
          <body>
          <h1>Report</h1>
          <ul>
            <li>Total todos: ${totalTodos}</li>
            <li>Total todos to be deleted: ${totalDeletedTodos}</li>
            <li>Total Users: ${totalUsers}</li>
          </ul>
          </body>
        </html>
        `;

      return html;
    };
    const sendEmail = async () => {
      try {
        const mailTransporter = nodemailer.createTransport({
          service: "gmail",
          // getting sender email and password from .env file
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
          },
        });
        // Getting the recipient email, subject and the message from the req body
        const mailDetails = {
          from: process.env.EMAIL,
          to: process.env.RECEIVER_EMAIL,
          subject: `TODO List: Reports for this week: ${
            new Date().toISOString().split("T")[0]
          }`,
          html: await generateReportHtml(),
        };
        mailTransporter.sendMail(mailDetails, (err, data) => {
          if (err) {
            // Returning the error message in case of any errors
            console.error("Something went wrong while sending email: ", err);
          } else {
            // Returning Success message when email is sent successfully
            console.log(`Reports sent successfully to ${req.body.to}`);
          }
        });
      } catch (err) {
        console.error("Something error happened while sending email: ", err);
      }
    };

    // Schedule the cron job to run every Sunday at 9 AM IST
    cron.schedule(
      "0 9 * * 0",
      () => {
        console.log("Sending reports to email...");
        sendEmail();
      },
      {
        scheduled: true,
        timezone: "Asia/Kolkata", // Set timezone to IST
      }
    );

    // Server
    app.listen(process.env.PORT, () => {
      console.log("listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
  });
