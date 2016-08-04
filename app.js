var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('./custom_modules/db');
var hbs_helpers = require('./custom_modules/hbs');
// var ghost_startup = require('ghost/core/server/utils/startup-check').check();
// var ghost = require('ghost/core');
var errors = require('ghost/core/server/errors');

var routes = require('./routes/index');
var brothers = require('./routes/brothers');
var contact = require('./routes/contact');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ghost().then(function (ghostServer) {
//     ghostServer.start();
// }).catch(function (err) {
//     errors.logErrorAndExit(err, err.context, err.help);
// });

app.use('/', routes);
app.use('/brothers', brothers);
app.use('/contact', contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

mongodb.connect(function() {});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
