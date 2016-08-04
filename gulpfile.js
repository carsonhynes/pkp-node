var gulp = require('gulp');
var changed = require('gulp-changed');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');

gulp.task('sass', function () {
    return gulp.src('./public/sass/**/*.scss')
        .pipe(changed('./public/css'))
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['./bower_components/bootstrap-sass/assets/stylesheets']
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

gulp.task('compress', function() {
    return gulp.src('./public/javascripts-tbc/*.js')
        .pipe(changed('./public/javascripts'))
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = ".min.js";
            return path;
        }))
        .pipe(gulp.dest('./public/javascripts'))
        .pipe(browserSync.stream());
});

gulp.task('browser-sync', ['nodemon'], function() {

    browserSync.init(null, {
        proxy: "http://localhost:3000",
        port: 3001,
        files: ["public/**/*.*"]
    });

    gulp.watch("./public/sass/**/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("./public/javascripts-tbc/*.js", ['compress']).on('change', browserSync.reload);
    gulp.watch("views/*.hbs").on('change', browserSync.reload);
});

gulp.task('nodemon', ['sass', 'compress'], function (cb) {

    var started = false;

    nodemon({
        script: 'bin/www',
        ignore: [
            'gulpfile.js',
            'node_modules/'
        ]
    });
    //     .on('start', function () {
    //     if (!started) {
    //         started = true;
    //         cb();
    //     }
    // }).on('restart', function () {
    //     setTimeout(function () {
    //         browserSync.reload({stream: false});
    //     }, 1000);
    // });
});

gulp.task('default', ['nodemon']);