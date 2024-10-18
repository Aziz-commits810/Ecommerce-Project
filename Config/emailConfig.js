const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "au7918316@gmail.com",
    pass: "zfap tykh wsug myyh",
  },
});

module.exports = transporter;
