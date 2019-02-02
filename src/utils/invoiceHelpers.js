import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

function setInvoiceContent(doc, order) {
    doc.fontSize(26).text('Invoice', { underline: true, align: 'center' }).moveDown();

    let total = 0;
    order.products.forEach(item => {
        const { product, quantity } = item;
        const { title, price, imageUrl } = product;
        const imagePath = path.join(__dirname, '../..', imageUrl);

        doc.fontSize(14).lineGap(6).text(`${title}`);
        doc.fontSize(14).text(`${quantity} X $${price}`).moveDown();
        doc.image(imagePath, {
            fit: [100, 100],
            align: 'center',
            valign: 'center'
        }).moveDown();
        total += price * quantity;
    });

    doc.text('---');
    doc.fontSize(18).text(`Total Price: $${total}`);
    doc.end();
}

export function createOrderInvoice(res, order) {
    const doc = new PDFDocument();
    const fileName = `invoice-${order._id.toString()}.pdf`;
    const filePath = path.join(__dirname, `../../data/invoices/${fileName}`);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    // res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    doc.pipe(fs.createWriteStream(filePath));
    doc.pipe(res);

    setInvoiceContent(doc, order);
}
