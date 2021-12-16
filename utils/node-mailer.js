const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
 service: 'Gmail',
 auth: {
     user: 'sae1013@gmail.com',
     pass: process.env.GOOGLE_NODE_MAIL,
 },
});

module.exports = (to, subject, content) => new Promise((resolve, reject) => {
  const message = {
    from: 'sae1013@gmail.com',
    to,
    subject,
    content,
  };
  
  transport.sendMail(message, (err, info) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(info);
  });
});