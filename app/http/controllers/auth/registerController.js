const controller = require('app/http/controllers/controller');
const passport = require('passport');

class registerController extends controller {

    showRegsitrationForm(req, res) {
        res.render('home/auth/register', { layout: "home/auth/master", recaptcha: this.recaptcha.render() });
    }

    registerProccess(req, res, next) {
        this.recaptchaValidation(req, res)
            .then(result => this.validationData(req))
            .then(result => {
                if (result) res.redirect('/auth/otp/send')
                else {
                    return this.back(req, res)
                }
            })
            .catch(err => console.log(err));
    }


    validationData(req) {


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

    register(req, res, next) {
        passport.authenticate('local.register', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true
        })(req, res, next);
    }

}

module.exports = new registerController();