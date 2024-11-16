// invoiceSender.js
require('dotenv').config();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Generates and sends a payment invoice via email.
 * @param {Object} order - Order data containing user email and invoice details.
 * @param {String} order.OrderInfo.email - Email address of the recipient.
 * @returns {Promise} - Resolves when the email is sent successfully.
 */
async function sendInvoice(order, ProductInfo) {
    return new Promise((resolve, reject) => {
        try {
            const drawDottedLine = (doc, xStart, yStart, xEnd) => {
                const dashLength = 3; // Length of each dot
                const gapLength = 2;  // Space between dots
                const totalLength = xEnd - xStart;
                let currentX = xStart;
                
                // Draw the dotted line by alternating between dots and gaps
                while (currentX < xEnd) {
                    doc.moveTo(currentX, yStart);
                    currentX += dashLength;
                    doc.lineTo(currentX, yStart);
                    doc.stroke();
                    currentX += gapLength; // Add gap between dots
                }
            };
            // Generate PDF invoice
            const doc = new PDFDocument({ margin: 50 });
            const filePath = './invoice.pdf';
            doc.pipe(fs.createWriteStream(filePath));

            // Header
            doc.fontSize(18).text('GADGET IT.com', { align: 'center', underline: true });
            doc.moveDown();
            doc.fontSize(16).text('Payment Invoice', { align: 'center' });
            doc.moveDown();

            // Order Info
            doc.fontSize(12).text(`ORDER ID: ${order.OrderInfo.order_id}`);
            doc.text(`Order Date: ${new Date(order.OrderInfo.order_date).toLocaleDateString()}`);
            doc.moveDown();

            // Table Header
            doc.fontSize(12).text('Product', 50, doc.y, { continued: true });
            doc.text('Quantity', 200, doc.y, { continued: true });
            doc.text('Price (TK)', 300, doc.y);
            doc.moveDown();
            drawDottedLine(doc, 50, doc.y, 550); // Dotted line separator
            doc.moveDown();

            // Product List
            for (let i = 0; i < ProductInfo.length; i++) {
                doc.text(`${ProductInfo[i].name}`, 50, doc.y, { continued: true });
                doc.text(`${order.OrderProducts[i].quantity}`, 200, doc.y, { continued: true });
                doc.text(`${ProductInfo[i].price} TK`, 300, doc.y);
            }
            doc.moveDown();
            drawDottedLine(doc, 50, doc.y, 550); // Dotted line separator
            doc.moveDown();

            // Total
            const total = ProductInfo.reduce((s, c) => s + c.price, 0);
            doc.text(`Total: ${total} TK`, { align: 'right' });
            doc.moveDown();
            doc.moveDown();

            // Footer function
            const addFooter = () => {
                doc.moveDown();
                doc.text('Thank you for your purchase!', { align: 'center' });
                doc.text('Visit us again at www.gadgetit.com', { align: 'center' });
            };

            addFooter(); // Now it's defined before use

            doc.end();



            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                },
                logger: true,  // Enable logs
                debug: true    // Include SMTP traffic in logs
            });

            // Send the email with the invoice attached
            const mailOptions = {
                from: `"GADGET IT.com" <${process.env.EMAIL}>`,
                to: order.OrderInfo.email,
                subject: 'Customer Payment Invoice',
                text: 'Please find attached your payment invoice.',
                attachments: [
                    {
                        filename: 'invoice.pdf',
                        path: filePath,
                        contentType: 'application/pdf',
                    },
                ],
            };

            transporter.sendMail(mailOptions, (err, info) => {
                fs.unlinkSync(filePath);

                if (err) {
                    console.error('Error sending email:', err);
                    return reject(err);
                }

                resolve(info);
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = sendInvoice;