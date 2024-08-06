const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
const TodoModel = require("../models/Todo");
const AuthModel = require("../models/AuthModel");

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
    console.log("Cron Job executed..")
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
  router.get('/get-reports', (req, res) => {
    try{
        sendEmail();
        res.json({"success": true})
    } catch (err) {
        res.status(500).json("error", err);
    }
    
  });

  module.exports = router