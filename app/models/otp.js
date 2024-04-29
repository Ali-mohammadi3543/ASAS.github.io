const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// import uniqueString from 'unique-string';

const otp = mongoose.Schema({
    phone: { type: String, require: true },
    otp: { type: Number, require: true },
    token: { type: String, require: true },
    use: { type: Boolean, default: false }
}, { timestamps: { updatedAt: false } });


module.exports = mongoose.model('otp', otp);