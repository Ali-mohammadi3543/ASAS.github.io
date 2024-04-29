const controller = require('app/http/controllers/controller');
const Course = require('app/models/course');
const Episode = require('app/models/episode');
const Comment = require('app/models/comment');
const i18n = require("i18n");
const sm = require('sitemap');
const rss = require('rss');
var fs = require('fs');
const striptags = require('striptags');
class imageController extends controller {


    async index(req, res) {
        // let user = await users.findOne({})

        fs.readFile('logo.jpg');
    }
}
module.exports = new imageController();