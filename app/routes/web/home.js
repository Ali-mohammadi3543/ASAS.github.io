const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('app/http/controllers/homeController');
// const courseController = require('app/http/controllers/courseController');
// const commentValidator = require('app/http/validators/commentValidator');
const userController = require('app/http/controllers/userController');
// const imageController = require('app/http/controllers/imagecontroller');


//Midleware
const convertFileToField = require('app/http/middleware/convertFileToField')
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
// const redirectifnotadmin = require('app/http/middleware/redirectifNotAdmin');
const ifnotuser = require('app/http/middleware/ifnotuser');
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');
const upload = require('app/helpers/uploadImage');


router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});

// Home Routes
router.get('/', homeController.index);
router.get('/lavat', homeController.lvt);
// router.get('/public/logo', imageController.index);
router.get('/shop', homeController.index);

// router.get('/courses', courseController.index);
// router.get('/courses/:course', courseController.notcourse, courseController.single);
// router.post('/courses/payment', courseController.payment);
// router.get('/courses/payment/checker', redirectIfNotAuthenticated.handle, courseController.checker);
// router.post('/comment', redirectIfNotAuthenticated.handle, commentValidator.handle(), homeController.comment);
// router.get('/download/:episode', courseController.download);

router.get('/user/panel', redirectIfNotAuthenticated.handle, userController.index);
router.get('/user/panel/Tickets', redirectIfNotAuthenticated.handle, userController.Ticket);
router.get('/user/panel/Tickets/New-Ticket', redirectIfNotAuthenticated.handle, userController.NewTicket);
router.post('/user/panel/ticket/SendTicket', redirectIfNotAuthenticated.handle, userController.SendTickets);
router.post('/user/panel/ticket/DeleteTicket', redirectIfNotAuthenticated.handle, userController.DeleteTickets);
router.post('/Ticket/NewTicket', redirectIfNotAuthenticated.handle, userController.CreateTickets);
router.get('/user/panel/ticket/:id', redirectIfNotAuthenticated.handle, userController.ShowTicket);

router.get('/sitemap.xml', homeController.sitemap);
router.get('/feed/courses', homeController.feedCourses);
router.get('/feed/episodes', homeController.feedEpisodes);

// router.get('/ajaxupload', (req, res, next) => res.render('home/ajaxupload'));
// router.post('/ajaxupload', upload.single('photo'), convertFileToField.handle, (req, res, next) => {
//     try {
//         res.json({ ...req.body, ...req.file })
//     } catch (err) {
//         next(err);
//     }
// });


module.exports = router;