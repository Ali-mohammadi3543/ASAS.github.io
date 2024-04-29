const controller = require('app/http/controllers/controller');
const request = require('request-promise');
const AllTickets = require('app/models/Ticket')
const SendTickets = require('app/models/TicketSend')
class userController extends controller {

    async index(req, res, next) {
        try {
            res.render('home/panel/panel', { layout: "home/panel/panel", title: 'پنل کاربری' });
        } catch (err) {
            next(err)
        }
    }
    async Ticket(req, res, next) {
        try {
            let Tickets = await AllTickets.find({ user: req.user.id }).sort({ createdAt: 1 }).limit(100).exec();
            res.render('home/panel/Ticket', { layout: "home/auth/master", title: 'Tickets', Tickets });
        } catch (err) {
            next(err)
        }
    }
    async NewTicket(req, res, next) {
        try {
            res.render('home/panel/New-Ticket', { layout: "home/panel/New-Ticket", title: 'NewTickets', validticket: false });
        } catch (err) {
            next(err)
        }
    }
    async CreateTickets(req, res, next) {
        try {
            const phoneRegex = /^\d{11}$/;

            // Check if the phone number is in the correct format
            if (!phoneRegex.test(req.body.number)) {
                return res.render('home/panel/New-Ticket', { layout: "home/panel/New-Ticket", title: 'NewTickets', validticket: true });
            }
            let NewTicket = new AllTickets({
                user: req.user.id,
                name: req.body.name,
                phone: req.body.number,
                TicketName: req.body.ticket
            });

            await NewTicket.save();
            let backTicket = await AllTickets.findOne({ $and: [{ phone: req.body.number }, { TicketName: req.body.ticket }, { user: req.user.id }] });
            return res.redirect('/user/panel/ticket/' + backTicket._id);
        } catch (err) {
            next(err);
        }
    }
    async ShowTicket(req, res, next) {
        try {
            this.isMongoId(req.params.id);
            let thistickets = await AllTickets.findById(req.params.id);
            // let tickets = await AllTickets.find({ _id: req.params.id, user: req.user.id }).sort({ createdAt: 1 }).limit(100).exec();
            let tickets = await SendTickets.paginate({ TicketId: req.params.id, user: req.user.id }, { sort: { createdAt: 1 }, limit: 15 });
            if (!thistickets) this.error('چنین دوره ای وجود ندارد', 404);
            if (req.user.id != thistickets.user) {
                return this.back(req, res)

            }
            // req.courseUserId = course.user;
            // if (!req.userCan('edit-courses')) {
            //     this.error('شما اجازه دسترسی به این صفحه را ندارید', 403);
            // }

            return res.render('home/panel/Single-Ticket', { layout: "home/panel/master", tickets, thistickets });
        } catch (err) {
            next(err);
        }
    }
    async SendTickets(req, res, next) {
        try {
            let NewTicket = new SendTickets({
                user: req.user.id,
                TicketId: req.body.token,
                Ticket: req.body.ticket
            });

            await NewTicket.save();

            return this.back(req, res);
        } catch (err) {
            next(err);
        }
    }
    async DeleteTickets(req, res, next) {
        try {
            let Ticket = await AllTickets.findById(req.body.token)
            let tickets = await SendTickets.findOne({ TicketId: req.body.token, user: req.user.id }).exec();
            if (!Ticket) this.error('چنین تیکت وجود ندارد', 404);
            if (tickets != null) {
                tickets.deleteOne();
            }
            Ticket.deleteOne();
            return res.redirect('/user/panel/Tickets')

        } catch (error) {
            next(error)
        }
    }
    async history(req, res, next) {
        try {
            let page = req.query.page || 1;
            let payments = await Payment.paginate({ user: req.user.id }, { page, sort: { createdAt: -1 }, limit: 20, populate: 'course' });

            res.render('home/panel/history', { title: 'پرداختی ها', payments });
        } catch (err) {
            next(err);
        }
    }

    async vip(req, res) {
        res.render('home/panel/vip');
    }


    async vipPayment(req, res, next) {
        try {
            let plan = req.body.plan,
                price = 0;

            switch (plan) {
                case "3":
                    price = 30000;
                    break;
                case "12":
                    price = 120000;
                    break;
                default:
                    price = 10000;
                    break;
            }


            // buy proccess
            let params = {
                MerchantID: 'f83cc956-f59f-11e6-889a-005056a205be',
                Amount: price,
                CallbackURL: 'http://localhost:3000/user/panel/vip/payment/check',
                Description: `بابت افزایش اعتبار ویژه`,
                Email: req.user.email
            };

            let options = this.getUrlOption(
                'https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json',
                params
            );

            request(options)
                .then(async data => {
                    let payment = new Payment({
                        user: req.user.id,
                        vip: true,
                        resnumber: data.Authority,
                        price: price
                    });

                    await payment.save();

                    res.redirect(`https://www.zarinpal.com/pg/StartPay/${data.Authority}`)
                })
                .catch(err => res.json(err.message));
        } catch (err) {
            next(err);
        }
    }

    async vipPaymentCheck(req, res, next) {
        try {
            if (req.query.Status && req.query.Status !== 'OK')
                return this.alertAndBack(req, res, {
                    title: 'دقت کنید',
                    message: 'پرداخت شما با موفقیت انجام نشد',
                });

            let payment = await Payment.findOne({ resnumber: req.query.Authority }).exec();


            if (!payment.vip)
                return this.alertAndBack(req, res, {
                    title: 'دقت کنید',
                    message: 'این تراکنش مربوط به افزایش اعتبار اعضای ویژه نمیشود',
                    type: 'error'
                });

            let params = {
                MerchantID: 'f83cc956-f59f-11e6-889a-005056a205be',
                Amount: payment.price,
                Authority: req.query.Authority
            }

            let options = this.getUrlOption('https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json', params)

            request(options)
                .then(async data => {
                    if (data.Status == 100) {
                        payment.set({ payment: true });

                        let time = 0,
                            type = '';

                        switch (payment.price) {
                            case 10000:
                                time = 1;
                                type = 'month';
                                break;
                            case 30000:
                                time = 3;
                                type = '3month';
                                break;
                            case 120000:
                                time = 12;
                                type = '12month';
                                break;
                        }

                        if (time == 0) {
                            this.alert(req, {
                                title: 'دقت کنید',
                                message: 'عملیات مورد نظر با موفقیت انجام نشد',
                                type: 'success',
                                button: 'بسیار خوب'
                            })
                            return res.redirect('/user/panel/vip')
                        }


                        let vipTime = req.user.isVip() ? new Date(req.user.vipTime) : new Date();
                        vipTime.setMonth(vipTime.getMonth() + time);

                        req.user.set({ vipTime, vipType: type });
                        await req.user.save()

                        await payment.save();

                        this.alert(req, {
                            title: 'با تشکر',
                            message: 'عملیات مورد نظر با موفقیت انجام شد',
                            type: 'success',
                            button: 'بسیار خوب'
                        })

                        res.redirect('/user/panel/vip');
                    } else {
                        this.alertAndBack(req, res, {
                            title: 'دقت کنید',
                            message: 'پرداخت شما با موفقیت انجام نشد',
                        });
                    }
                }).catch(err => {
                    next(err);
                })
        } catch (err) {
            next(err);
        }
    }

    getUrlOption(url, params) {
        return {
            method: 'POST',
            uri: url,
            headers: {
                'cache-control': 'no-cache',
                'content-type': 'application/json'
            },
            body: params,
            json: true
        }
    }
}

module.exports = new userController();