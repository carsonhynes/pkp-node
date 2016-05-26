var express = require('express');
var router = express.Router();
var mongodb = require('../custom_modules/db');

var context = {
    footer_img_src: "images/footer/",
    img_src: "images/current-composites/"
};

router.get('/', function(req, res, next) {

    var db = mongodb.db();
    var positions = ['archon', 'vice-archon', 'alumni-sec'];

    if (db) {
        mongodb.getPeopleFromPositions(db, positions, function (results) {
            context.archon = results[0];
            context.vice = results[1];
            context.alumni_sec = results[2];
            res.render('index', context);
        });
    }
    else {
        console.log("database not connected");
    }
});

module.exports = router;
