const express = require('express');
const router = express.Router();
const passport = require('passport');
const rateLimit = require('express-rate-limit');
// Controllers
const loginController = require('app/http/controllers/auth/loginController');
const numberController = require('app/http/controllers/auth/numberController');
// const registerController = require('app/http/controllers/auth/registerController');
// const forgotpasswordcontroller = require('app/http/controllers/auth/forgotpasswordcontroller')
// const resetpasswordcontroller = require('app/http/controllers/auth/resetpasswordcontroller')
const authredirect = require('app/http/controllers/auth/authredirect')
const otpcontroller = require('app/http/controllers/auth/otpController')
//Validator
// const registervalidator = require('app/http/validators/registerValidator')
// const forgotPasswordValidator = require('app/http/validators/forgotPasswordValidator')
// const resetPasswordValidator = require('app/http/validators/resetPasswordValidator')
// const loginvalidator = require('app/http/validators/loginValidator')
// Middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const limiter = rateLimit({
    windowMs: 15 * 4 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message: 'to many request',
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
})
// Home Routes
router.get('/', authredirect.authtologin)
router.get('/login', loginController.showLoginForm);
router.post('/login', otpcontroller.sender)
router.get('/otp', otpcontroller.showOtpForm);
router.post('/otp/send', otpcontroller.sender);
router.post('/otp/verify', limiter, otpcontroller.Otpverify);


module.exports = router;