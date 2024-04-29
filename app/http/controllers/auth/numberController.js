const controller = require('app/http/controllers/controller');
const passport = require('passport');
const SendOtp = require('sendotp');
const request = require('request');
var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({
    apikey: '6377786B304A5430725676597764703333394A54473149496B764F62654F4C617537673531346B6A7668383D'
});
const sendOtp = new SendOtp('', '{{otp}}');
class numberController extends controller {

    showNumberForm(req, res) {
        // const image = 'logo.jpg'

        res.render('home/auth/number', { layout: "home/auth/master" });
    }
}

module.exports = new numberController();