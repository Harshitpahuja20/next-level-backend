require("dotenv").config();
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const express = require("express");
const app = express();

// Set the views directory for email templates
app.set("views", "../assets/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

async function SendMail(mail, otp) {
  let readHTMLfile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
      if (err) {
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wsite404@gmail.com",
      pass: "svdx qiew fija pzxs",
    },
  });

  const path = "../NextLevelFunding Backend/app/assets/views/email.html";

  readHTMLfile(path, function (err, html) {
    if (err) {
      console.error(err);
      return;
    }

    var template = handlebars.compile(html);
    var replacements = {
      otp: otp,
    };
    var htmltoSend = template(replacements);

    let sendmail = transporter.sendMail({
      from: 'NextLevelFunding Application', // Fixed the from address
      to: mail,
      subject: "Verification Code",
      html: htmltoSend,
    });

    console.log("Message sent: %s", sendmail.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(sendmail));
  });
}

module.exports = { SendMail };