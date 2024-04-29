const controller = require('app/http/controllers/controller');
const passport = require('passport');

class authredirect extends controller {
    authtologin(req, res) {
        res.redirect('/admin/courses')
    }
}
module.exports = new authredirect();