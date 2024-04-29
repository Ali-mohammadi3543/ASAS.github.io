const controller = require('app/http/controllers/controller');
const passport = require('passport');
const User = require('app/models/user');
const express = require('express');
const app = express();
const flash = require('connect-flash');

app.use(flash());


class loginController extends controller {

    showLoginForm(req, res) {
        // const image = 'logo.jpg'
        // Load the specific page
        const referringPage = req.headers.referer;

        // Load the specific page
        res.render('home/auth/login', { layout: "home/auth/master", recaptcha: this.recaptcha.render(), invalidPhoneNumber: false });

        // Redirect to a default page or show an error

    }

    loginProccess(req, res, next) {
        this.recaptchaValidation(req, res)
            .then(result => this.validationData(req))
            .then(result => {
                if (result) this.login(req, res, next)
                else {
                    this.back(req, res);
                }
            })
            .catch(err => console.log(err));
    }


    validationData(req) {
        // req.checkBody('email', '').isEmail();
        // req.checkBody('password', '').isLength({ min: 8 });

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

    async login(req, res, next) {
        passport.authenticate('local.login', (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/auth/login');
            }
            req.logIn(user, err => {
                if (err) {
                    return next(err);
                }
                if (req.body.remember) {
                    user.setRememberToken(res);
                }
                return res.redirect('/');
            });
        })(req, res, next);
    }


}

module.exports = new loginController();