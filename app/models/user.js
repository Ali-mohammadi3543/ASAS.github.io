const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const userSchema = Schema({
    admin: { type: Boolean, default: false },
    phone: { type: String, required: true }, // Ensure phone field is unique if necessary
    vipTime: { type: Date, default: Date.now },
    vipType: { type: String, default: 'month' },
    learning: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
}, { timestamps: true, toJSON: { virtuals: true } });

userSchema.plugin(mongoosePaginate);

userSchema.virtual('courses', {
    ref: 'Course',
    localField: '_id',
    foreignField: 'user'
});

userSchema.methods.hasRole = function (roles) {
    let result = roles.filter(role => {
        return this.roles.indexOf(role) > -1;
    });
    return !!result.length;
}

userSchema.methods.isVip = function () {
    return new Date(this.vipTime) > new Date();
}

userSchema.methods.checkLearning = function (courseId) {
    return this.learning.indexOf(courseId) !== -1;
}

module.exports = mongoose.model('User', userSchema);
