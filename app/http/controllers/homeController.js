const controller = require('app/http/controllers/controller');
const Course = require('app/models/user');
const Episode = require('app/models/user');
const Ticket = require('app/models/Ticket');
const i18n = require("i18n");
const sm = require('sitemap');
const rss = require('rss');
const striptags = require('striptags');
class homeController extends controller {


    async index(req, res) {
        // let user = await users.findOne({})

        let courses = await Course.find({ lang: req.getLocale() }).sort({ createdAt: 1 }).limit(8).exec();
        res.render('home/index', { layout: 'home/index', courses });
    }
    async lvt(req, res) {
        res.render('home/lvt', { layout: 'home/lvt' });
    }
    async about(req, res) {
        res.render('home/about', { layout: 'home/about' });
    }
    async contact(req, res) {
        res.render('home/contact-us', { layout: 'home/contact-us' });
    }

    async sitemap(req, res, next) {
        try {
            let sitemap = sm.createSitemap({
                hostname: 'http://lcoalhost:5000'
                // cacheTime : 600000
            });

            sitemap.add({ url: '/', changefreq: 'daily', priority: 1 });
            sitemap.add({ url: '/courses', priority: 1 });



            res.header('Content-type', 'application/xml');
            res.send(sitemap.toString());

        } catch (err) {
            next(err);
        }
    }

    async feedCourses(req, res, next) {
        try {
            let feed = new rss({
                title: 'فید خوان دوره های راکت',
                description: 'جدیدترین دوره ها را از طریق rss بخوانید',
                feed_url: `${config.siteurl}/feed/courses`,
                site_url: config.site_url,
            });

            let courses = await Course.find({}).populate('user').sort({ createdAt: -1 }).exec();
            courses.forEach(course => {
                feed.item({
                    title: course.title,
                    description: striptags(course.body.substr(0, 100)),
                    date: course.createdAt,
                    url: course.path(),
                    author: course.user.name
                })
            })

            res.header('Content-type', 'application/xml');
            res.send(feed.xml());

        } catch (err) {
            next(err);
        }
    }

    async feedEpisodes(req, res, next) {
        try {
            let feed = new rss({
                title: 'فید خوان جلسات دوره های های راکت',
                description: 'جدیدترین دوره ها را از طریق rss بخوانید',
                feed_url: `${config.siteurl}/feed/courses`,
                site_url: config.site_url,
            });

            let episodes = await Episode.find({}).populate({ path: 'course', populate: 'user' }).sort({ createdAt: -1 }).exec();
            episodes.forEach(episode => {
                feed.item({
                    title: episode.title,
                    description: striptags(episode.body.substr(0, 100)),
                    date: episode.createdAt,
                    url: episode.path(),
                    author: episode.course.user.name
                })
            })

            res.header('Content-type', 'application/xml');
            res.send(feed.xml());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new homeController();