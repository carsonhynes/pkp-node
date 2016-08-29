var express = require('express');
var router = express.Router();
var mongodb = require('../custom_modules/db');
var fs = require('fs');
var path = require('path');
var marked = require('marked');

var context = {
    footer_img_src: "images/footer/",
    img_src: "images/current-composites/",
    title: "News"
};

router.get('/', function(req, res, next) {

    var db = mongodb.db();
    var positions = ['archon', 'vice-archon', 'alumni-sec'];
    context.blog_posts = [];
    context.blog_titles = [];

    if (db) {
        mongodb.getPeopleFromPositions(db, positions, function (results) {
            context.archon = results[0];
            context.vice = results[1];
            context.alumni_sec = results[2];
        });

        var directory = path.dirname(fs.realpathSync(__filename)) + "/../blog_posts/news";

        fs.readdir(directory, function (err, files) {
            files.forEach(function (element, index, array) {
                var filePath = directory + "/" + element;
                fs.readFile(filePath, 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    context.blog_posts.push(marked(data));
                    console.log(element);
                    context.blog_titles.push(element);
                })
            });
            res.render('news', context);
        })

    }

    else {
        console.log("database not connected");
    }
});

module.exports = router;
