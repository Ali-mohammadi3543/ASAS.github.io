const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');

const TicketSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    TicketName: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    // Ticket: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
    Ticket: [{ type: Object, required: false }],
    approved: { type: Boolean, default: false },
    AdminTicket: [{ type: Object, required: false }],
    onticket: { type: Boolean, default: false }//on or close ticket
}, { timestamps: true, toJSON: { virtuals: true } });

TicketSchema.plugin(mongoosePaginate);

TicketSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parent'
})

const commentBelong = doc => {
    if (doc.course)
        return 'Course';
    else if (doc.episode)
        return 'Episode'
}

TicketSchema.virtual('belongTo', {
    ref: commentBelong,
    localField: doc => commentBelong(doc).toLowerCase(),
    foreignField: '_id',
    justOne: true
})
TicketSchema.methods.inc = async function (field, num = 1) {
    this[field] += num;
    await this.save();
}





module.exports = mongoose.model('Ticket', TicketSchema);