const nodemailer =require("nodemailer");

async function sendEmail(params) {

    try {
        const transporter =
            nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
        await transporter.sendMail({
            from:
                process.env.EMAIL_USER,
            to:
                params.to,
            subject:
                params.subject,
            text:
                params.message
        });
        return {
            message:
                "Email sent successfully"
        };
    }
    catch (error) {
        return {
            error:
                "Email failed"
        };
    }
}

module.exports =sendEmail;