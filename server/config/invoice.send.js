require('dotenv').config();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * @param {Object} order 
 * @param {String} order.OrderInfo.email 
 * @returns {Promise} 
 */

async function sendInvoice(order, ProductInfo) {
    return new Promise((resolve, reject) => {
        try {
            const drawDottedLine = (doc, xStart, yStart, xEnd) => {
                const dashLength = 3;
                const gapLength = 2;
                let currentX = xStart;

                while (currentX < xEnd) {
                    doc.moveTo(currentX, yStart);
                    currentX += dashLength;
                    doc.lineTo(currentX, yStart);
                    doc.stroke();
                    currentX += gapLength;
                }
            };

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
            doc.text('Quantity', 250, doc.y, { continued: true });
            doc.text('Price (TK)', 350, doc.y);
            doc.moveDown();
            drawDottedLine(doc, 50, doc.y, 550); // Separator
            doc.moveDown();

            // Product List
            for (let i = 0; i < ProductInfo.length; i++) {
                const currentY = doc.y;

                doc.text(`${ProductInfo[i].name}`, 50, currentY, { width: 150, align: 'left' });
                doc.text(`${order.OrderProducts[i].quantity}`, 250, currentY, { width: 100, align: 'right' });
                doc.text(`${ProductInfo[i].price} TK`, 350, currentY, { width: 100, align: 'right' });
                if (i !== ProductInfo.length - 1) {
                    doc.moveDown(1.5); // Spacing between rows
                }
            }

            doc.moveDown();
            drawDottedLine(doc, 50, doc.y, 550);
            doc.moveDown();

            // Total
            const total = ProductInfo.reduce((s, c) => s + c.price, 0);
            doc.text(`Total: ${total} TK`, 450, doc.y, { width: 100, align: 'right' });
            doc.moveDown();

            // Footer
            const addFooter = () => {
                doc.moveDown(2);

                const pageWidth = doc.page.width; // Get the page width
                const footerText1 = 'Thank you for your purchase!';
                const footerText2 = 'Visit us again at www.GadgetIT.com';

                // Calculate the width of the text for each line to center it
                const textWidth1 = doc.widthOfString(footerText1);
                const textWidth2 = doc.widthOfString(footerText2);

                // Center the text by subtracting the width from the page width and dividing by 2
                const xPosition1 = (pageWidth - textWidth1) / 2;
                const xPosition2 = (pageWidth - textWidth2) / 2;

                // Draw the text with calculated x positions
                doc.text(footerText1, xPosition1, doc.y, { baseline: 'middle' });
                doc.text(footerText2, xPosition2, doc.y + 15, { baseline: 'middle' });
            };

            addFooter();

            doc.end();

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                },
                logger: true,
                debug: true,
                connectionTimeout: 5000,  // Timeout for establishing a connection
                socketTimeout: 10000,      // Timeout for socket inactivity 
            });

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
                if (err) return reject(err);
                resolve(info);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = sendInvoice;