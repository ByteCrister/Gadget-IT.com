require('dotenv').config();
const nodemailer = require('nodemailer');

exports.SendUserMail = (To, subject, link) => {
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
            html: `<h1><sup>*****</sup>After confirmation you have to log in to the Website<sup>*****</sup></h1>
             <h2>Please click on confirm - <a href="${link}"><b>Confirm</b></a></h2>
        <p><sup>*****</sup>This confirmation link will expire in <strong>5 minutes</strong><sup>*****</sup></p>`
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
