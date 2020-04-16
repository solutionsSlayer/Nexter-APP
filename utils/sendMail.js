const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
    constructor(user, url) {
        this.url = url;
        this.firstName = user.name.split(" ")[0];
        this.to = user.email;
        this.from = `Dorian Doussain <${process.env.EMAIL}>`;
    }

    newTransport() {
        // 1) Create the transporter
        if (process.env.NODE_ENV === "prod") {
            // SENDGRID
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD
                }
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // 2) Define the mailOptions and template custom
    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            url: this.url,
            firstName: this.firstName,
            to: this.to,
            from: this.from
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: htmlToText.fromString(html),
            html
        };

        // 3) Send the email
        await this.newTransport().sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    }

    async sendWelcome() {
        await this.send("welcome", "Welcome to the Nexter agency!");
    }

    async sendResetPwd() {
        await this.send("resetPassword", "Reset your password");
    }
};