const controller = require('app/http/controllers/controller');
const passport = require('passport');
const passwordReset = require('app/models/user');
const User = require('app/models/user')
const uniqueString = require('unique-string')
const mail = require('app/helpers/mail');
const express = require('express');
const layout = require('../../../../config/layout');
const app = express();
class forgotpasswordcontroller extends controller {

    showforgotpassword(req, res) {
        const title = 'فراموشی رمز عبور';
        app.set("layout", "home/auth/passwords/master");
        res.render('home/auth/passwords/forget', { layout: "home/auth/passwords/master", recaptcha: this.recaptcha.render() });
    }

    sendpasswordlink(req, res, next) {
        this.recaptchaValidation(req, res)
            .then(result => this.validationData(req))
            .then(result => {
                if (result) this.sendresetlink(req, res, next)
                else {
                    return this.back(req, res)
                }
            })
            .catch(err => console.log(err));
    }

    validationData(req) {
        req.checkBody('email', 'فیلد ایمیل معتبر نیست').isEmail();

        return req.getValidationResult()
            .then(result => {
                const errors = result.array();
                const messages = [];
                errors.forEach(err => messages.push(err.msg));

                if (errors.length == 0)
                    return true;

                req.flash('errors', messages)
                return false;
            })
            .catch(err => console.log(err));
    }

    async sendresetlink(req, res, next) {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash('errors', 'کاربر وجود ندارد')
            return this.back(req, res);
        }
        const NewPasswordReset = new passwordReset({
            email: req.body.email,
            token: uniqueString()
        });
        await NewPasswordReset.save();
        // sendmail
        req.flash('success', 'ایمیل ارسال شد');
        res.redirect('/');

        let mailOptions = {
            from: '"مجله آموزشی راکت 👻" <info@nodejs.roocket.ir>', // sender address
            to: `${NewPasswordReset.email}`, // list of receivers
            subject: 'ریست کردن پسورد', // Subject line
            html: `
            <h2>ریست کردن پسورد</h2>
            <p>برای ریست کردن پسورد بر روی لینک زیر کلیک کنید</p>
            <a href="http://localhost:3001/auth/password/reset/${NewPasswordReset.token}">ریست کردن</a>
        ` // html body
        };

        mail.sendMail(mailOptions, (err, info) => {
            if (err) return console.log(err);

            console.log('Message Sent : %s', info.messageId);

            this.alert(req, {
                title: 'دقت کنید',
                message: 'ایمیل حاوی لینک پسورد به ایمیل شما ارسال شد',
                type: 'success'
            });

            return res.redirect('/');

        })
    }
}

module.exports = new forgotpasswordcontroller();