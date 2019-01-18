import dotenv from 'dotenv';
import nodeMailer from 'nodemailer';
import sendGrid from 'nodemailer-sendgrid-transport';

dotenv.config();

export function sighUpMail({ email, firstName }) {
    return {
        to: [email],
        from: 'info@node-shop.com',
        subject: 'Welcome to Our Online Shop!',
        text: 'Awesome',
        html: `
            <h1>Hello ${firstName || ''},</h1>
            <h2>You successfully signed up!</h2>
        `,
    };
}

export default nodeMailer.createTransport(sendGrid({
    auth: {
        api_key: process.env.SENDGRID_API_KEY,
    },
}));
