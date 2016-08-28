var express = require('express');
var router = express.Router();
var mongodb = require('../custom_modules/db');
var assert = require('assert');

var context = {
    footer_img_src: "/images/footer/",
    img_src: "/images/current-composites/",
    title: "Brothers"
};

router.get('/', function(req, res, next) {

    var db = mongodb.db();
    var positions = ['archon', 'vice-archon', 'alumni-sec'];

    if (db) {
        mongodb.getPeopleFromPositions(db, positions, function (results) {
            context.archon = results[0];
            context.vice = results[1];
            context.alumni_sec = results[2];
        });
    }
    else {
        console.log("database not connected");
    }

    if (db) {
        db.collection('brothers').find({status: "brother"}).sort({last_name: 1}).toArray(function (err, results) {
            context.freshman = [];
            context.sophomores = [];
            context.juniors = [];
            context.seniors = [];
            context.supers = [];
            var today = new Date();
            var compDate = new Date("August 1");
            var thisYear = today.getFullYear();

            if (today > compDate) thisYear -= 1;

            results.forEach(function (result) {
                switch (result.matric_year) {
                    case thisYear: {
                        context.freshman.push(result);
                        break;
                    }
                    case thisYear-1: {
                        context.sophomores.push(result);
                        break;
                    }
                    case thisYear-2: {
                        context.juniors.push(result);
                        break;
                    }
                    case thisYear-3: {
                        context.seniors.push(result);
                        break;
                    }
                    case thisYear-4: {
                        context.supers.push(result);
                        break;
                    }
                }
            });
            var size = context.freshman.length + context.sophomores.length + context.juniors.length +
                context.seniors.length + context.supers.length;
            assert(size === results.length);
            res.render('brothers', context);
        });
    }
});

module.exports = router;
