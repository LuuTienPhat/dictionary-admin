const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "yourpassword",
  },
});

const mailOptionsHTML = {
  from: "youremail@gmail.com",
  to: "myfriend@yahoo.com",
  subject: "Sending Email using Node.js",
  html: "<h1>Welcome</h1><p>That was easy!</p>",
};

exports.sendMail = (sender, receivers, subject, text) => {
  let mailOptions = {
    from: sender,
    to: receivers.toString(),
    subject: subject,
    text: text,
  };

  send(mailOptions);
};

const send = (mailOptions) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
