
const nodeoutlook = require('nodejs-nodemailer-outlook');

const sendMail = async (mailOptions) => {
    nodeoutlook.sendEmail({
        auth: {
            user: process.env.EMAIL_ADDR,
            pass: process.env.EMAIL_PASS
        },
        ...mailOptions,
        onError: (e) => console.log(e),
        onSuccess: (i) => console.log(i)
    });
};


module.exports = sendMail;