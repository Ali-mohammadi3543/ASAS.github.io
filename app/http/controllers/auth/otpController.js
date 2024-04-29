const controller = require('app/http/controllers/controller');
const passport = require('passport');
const request = require('request');
const User = require('app/models/user');
const localStrategy = require('passport-local').Strategy;
const express = require('express');
const app = express();
const Otp = require('app/models/otp');
const uniqueString = require('unique-string')
const swal = require('sweetalert2')
var Kavenegar = require('kavenegar');
const { closeSync } = require('fs');
const flash = require('connect-flash');
var api = Kavenegar.KavenegarApi({
    apikey: '2F613061507053577A654B4D4B544B5A7146752B3670694E445A467A5469306E6A6D72526A6F6A2F5767413D'
});
const OTP_TIMEOUT = 1 * 60 * 1000; // 30 Seconds

let otpTimer;
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
app.use(flash());

class otpController extends controller {


    async sender(req, res, next) {
        const phoneRegex = /^\d{11}$/;
        function isPhoneNumber(input) {
            return phoneRegex.test(input);
        }
        if (!isPhoneNumber(req.body.number)) {
            res.render('home/auth/login', { layout: "home/auth/master", invalidPhoneNumber: true });
            return; // Stop execution
        }


        // let user = await User.findOne({ email: req.body.email });
        // if (user) {
        //     return this.back(req, res);
        // }
        const sendedotp = Math.floor(Math.random() * 90000) + 10000;
        // const data = ({
        //     name: req.body.name,
        //     phone: req.body.phone,
        //     email: req.body.email,
        //     password: req.body.password
        // })
        // console.log(data);
        api.Send({
            message: `${sendedotp} این یک پیام آزمایشی است.`,
            sender: "10008663",
            receptor: req.body.number
        },
            async function (response, status) {
                console.log(response);
                console.log(status);
                if (status == 200) {

                    const NewOtpSend = new Otp({
                        phone: req.body.number,
                        otp: sendedotp,
                        token: uniqueString()
                    });
                    await NewOtpSend.save();
                    let otpfind = await Otp.findOne({ $and: [{ phone: req.body.number }, { use: false }] });
                    const OtpLimit = await Otp.findOne({ token: otpfind.token });
                    try {
                        otpTimer = setTimeout(async () => {
                            if (OtpLimit.use == false) {
                                await OtpLimit.updateOne({ use: true });
                            }
                            // Perform actions when OTP expires
                        }, OTP_TIMEOUT);
                    } catch (error) {
                        // Handle errors
                        console.error(error);
                    }
                    return res.redirect('/auth/otp?token=' + otpfind.token);
                }
                else {

                    return res.redirect('/')
                }

            });
    }
    async showOtpForm(req, res) {
        // const image = 'logo.jpg'
        const referringPage = req.headers.referer;
        if (referringPage && referringPage.includes('/auth/login')) {
            // Load the specific page
            var passedVariable = req.query.token;
            res.render('home/auth/Otp', { passedVariable, layout: "home/auth/master", validotp: false });
        }
        else {
            res.render('errors/403', { layout: 'errors/403' })
        }

    }
    async Otpverify(req, res, next) {
        var passedVariable = req.body.token;
        const Otpfind = await Otp.findOne({ token: req.body.token });
        let field = await Otp.findOne({ $and: [{ token: req.body.token }, { otp: Otpfind.otp }] });
        if (!Otpfind) {
            return res.redirect('/');
        }
        if (field.use) {
            return res.redirect('/');
        }
        if (field.phone != Otpfind.phone) {
            res.redirect('/');
        }
        if (req.body.otp == Otpfind.otp) {
            try {
                passport.serializeUser(function (user, done) {
                    done(null, user.id);
                });

                // Deserialize user
                passport.deserializeUser(async function (id, done) {
                    try {
                        const user = await User.findById(id);
                        done(null, user);
                    } catch (err) {
                        done(err, null);
                    }
                });

                const user = await User.findOne({ phone: Otpfind.phone });
                if (!user) {
                    const newUser = new User({
                        phone: Otpfind.phone
                    });
                    newUser.save().then(async user => {
                        req.login(user, async function (err) {
                            if (err) { return next(err); }
                            await Otpfind.updateOne({ use: true });
                            return res.redirect('/');
                        });
                    }).catch(err => {
                        console.error('Error saving user:', err);
                        return res.status(500).send('Error saving user');
                    });
                }
                if (user) {
                    // passport.authenticate('local.login', (err, user) => {

                    req.logIn(user, async err => {
                        if (err) {
                            return err;
                        }
                        await Otpfind.updateOne({ use: true });

                        return res.redirect('/');
                    })

                    // })(req, res, next);
                }

            } catch (error) {
                return error;
            }
        }
        else {
            res.render('home/auth/Otp', { layout: "home/auth/master", passedVariable, validotp: true });
            return; // Stop execution     
        }

    }


}


module.exports = new otpController();