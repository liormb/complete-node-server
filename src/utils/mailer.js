import dotenv from 'dotenv';
import nodeMailer from 'nodemailer';
import sendGrid from 'nodemailer-sendgrid-transport';

dotenv.config();

export function sighUpMail({ email, firstName }) {
    return {
        to: [email],
        from: 'info@node-shop.com',
        subject: 'Welcome to Our Online Shop!',
        html: `
            <h1>Hello ${firstName || ''},</h1>
            <h2>You successfully signed up!</h2>
        `,
    };
}

export function resetPasswordEmail({ email, firstName, lastName, token }) {
    return {
        to: [email],
        from: 'info@node-shop.com',
        subject: 'Password Reset | Online Shop',
        html: `
            <h1>Hello ${firstName} ${lastName},</h1>
            <h3>You requested a password reset</h3>
            <h3>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password</h3>
        `,
    };
}

export default nodeMailer.createTransport(sendGrid({
    auth: {
        api_key: process.env.SENDGRID_API_KEY,
    },
}));
