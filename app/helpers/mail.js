const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: '9e4bd377da768f', // generated ethereal user
        pass: '303b68b783f5f9' // generated ethereal password
    }
});

module.exports = transporter;