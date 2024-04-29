const controller = require('app/http/controllers/controller');
const User = require('app/models/user');
const Ticket = require('app/models/Ticket');
const SendedTicket = require('app/models/TicketSend');


class TicketController extends controller {
    async index(req, res, next) {
        try {
            let Tickets = await Ticket.paginate({}, { sort: { createdAt: 1 }, limit: 20 });
            res.render('admin/Ticket/Admin-ticket', { title: 'Tickets', Tickets });
        } catch (err) {
            next(err);
        }
    }
    async response(req, res, next) {
        try {
            this.isMongoId(req.params.id);
            let tickets = await SendedTicket.paginate({ TicketId: req.params.id }, { sort: { createdAt: 1 }, limit: 50 });
            res.render('admin/Ticket/response', { title: 'Tickets', tickets });
        } catch (err) {
            next(err);
        }
    }
    async Sendresponse(req, res, next) {
        try {
            let NewTicket = new SendedTicket({
                user: req.user.id,
                TicketId: req.body.token,
                Ticket: req.body.sendticket,
                AdminTicket: true
            });

            await NewTicket.save();

            return res.redirect('/admin/response/' + req.body.token);
        } catch (err) {
            next(err);
        }
    }

}

module.exports = new TicketController();