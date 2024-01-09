require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

function generateOtp() {
  return Math.floor(Math.random() * 9000) + 999;
}

async function SendMail(mail, otp) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wsite404@gmail.com",
        pass: "svdx qiew fija pzxs",
      },
    });
    transporter.sendMail({
      from: "Next Level Funding",
      to: mail,
      subject: "Verfication Code",
      text: mail,
      html: `<b>${otp}</b>`,
    });
  } catch (error) {
    console.log("Error in Sending Otp");
  }
}

function genToken(id) {
  return jwt.sign({ id }, "SUPER_SECRET" , { expiresIn: "1w" });
}

module.exports = { generateOtp, SendMail, genToken };
