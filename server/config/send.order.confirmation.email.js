require('dotenv').config();
const nodemailer = require('nodemailer');

exports.SendOrderConfirmationMail = (To, subject, digits) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        let mailOptions = {
            from: `"GADGET IT.com" <${process.env.EMAIL}>`,
            to: To,
            subject: subject,
            html: `<h1><sup>*****</sup> Digit: ${digits} <sup>*****</sup></h1>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(false);
            } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                resolve(true);
            }
        });
    });
};
