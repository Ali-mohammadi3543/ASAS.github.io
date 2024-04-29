const User = require('app/models/user');
const middleware = require('./middleware');
const controller = require('app/http/controllers/courseController');

class ifnotuser extends middleware {

    async index(req, res) {
        let courses = await Course.find({}).sort({ createdAt: 1 }).limit(8).exec();
        // res.render('home/index', { courses });
    }
    async notcourse(req, res, next) {
        let course = await Course.findOne({ slug: req.params.course })
        if (!course) {
            res.json('همچین دوره ای وجود ندارد')
        }
        else {
            next()
        }
    }

    async single(req, res) {
        let course = await Course.findOne({ slug: req.params.course })

            .populate([
                {
                    path: 'user',
                    select: 'name'
                },
                {
                    path: 'episodes',
                    options: {
                        sort: { number: 1 }
                    }
                }
            ]);
        let canUserUse = await this.canUse(req, course);

        // res.render('home/single-course', { course, canUserUse });
    }
    // async redirect(req, course) {
    //     let canUse = false;
    //     if (req.isAuthenticated()) {
    //         switch (course.type) {
    //             case 'vip':
    //                 canUse = req.user.isVip()
    //                 break;
    //             case 'cash':
    //                 canUse = req.user.checkLearning(course);
    //                 break;
    //             default:
    //                 canUse = true;
    //                 break;
    //         }
    //     }
    //     return canUse;
    // }
    async canUse(req, course) {
        let canUse = false;
        if (req.isAuthenticated()) {
            switch (course.type) {
                case 'vip':
                    canUse = req.user.isVip()
                    break;
                case 'cash':
                    canUse = req.user.checkLearning(course);
                    break;
                default:
                    canUse = true;
                    break;
            }
        }
        return canUse;
    }



}


module.exports = new ifnotuser();