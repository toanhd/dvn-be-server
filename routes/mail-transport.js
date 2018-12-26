const nodemailer = require("nodemailer");

const smtpTransport = nodemailer.createTransport(({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: "toanhanduc@gmail.com",
        clientId: "895938302652-lkl52tavj5bd234padpk6kgctc3csvpp.apps.googleusercontent.com",
        clientSecret: "Q8kv1ZsFqjjGv-o8eQRUDqyw",
        refreshToken: "1/Q43T49lm-uh2Hw8fzffBlSlDlc2zbv8jxzLFGBTRFuc"
    }
}));

module.exports = {
    smtpTransport
};
