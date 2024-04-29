const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');

const TicketSendSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    TicketId: { type: Schema.Types.ObjectId, ref: 'Ticket' },
    name: { type: String, required: false },
    phone: { type: String, required: false },
    // Ticket: [{ type: Schema.Types.ObjectId, ref: 'Ticket' }],
    Ticket: [{ type: String, required: false }],
    approved: { type: Boolean, default: false },
    AdminTicket: { type: Boolean, default: false },
    onticket: { type: Boolean, default: false }//on or close ticket
}, { timestamps: true, toJSON: { virtuals: true } });
TicketSendSchema.plugin(mongoosePaginate);





module.exports = mongoose.model('TicketSend', TicketSendSchema);