const path = require('path');
const autoBind = require('auto-bind');
const moment = require('moment-jalaali');
moment.loadPersian({ usePersianDigits: true })

module.exports = class Helpers {

    constructor(req, res) {
        autoBind(this);
        this.req = req;
        this.res = res;

        this.formData = req.flash('formData')[0];
    }

    getObjects() {
        return {
            auth: this.auth(),
            viewPath: this.viewPath,
            ...this.getGlobalVaribales(),
            old: this.old,
            date: this.date,
            req: this.req


        }
    }



    viewPath(dir) {
        return path.resolve(config.layout.view_dir + '/' + dir);
    }

    getGlobalVaribales() {
        return {
            errors: this.req.flash('errors')
        }
    }

    old(field, defaultValue = '') {
        return this.formData && this.formData.hasOwnProperty(field) ? this.formData[field] : defaultValue;
    }
    redirect() {
        return
        red: this.req.header('Referrer') || '/courses/:courses';
    }
    auth() {
        return {
            check: this.req.isAuthenticated(),
            user: this.req.user,
            admin: this.req.admin
        }
    }
    date(time) {
        return moment(time);
    }
}