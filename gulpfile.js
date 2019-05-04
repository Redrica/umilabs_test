var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    pug = require('gulp-pug'),
    plumber = require("gulp-plumber"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    minify = require("gulp-csso"),
    rename = require("gulp-rename"),
    imagemin = require("gulp-imagemin"),
    del = require("del"),
    run = require("run-sequence"),
    jsmin = require("gulp-jsmin");

gulp.task('pug', function buildHTML() {
    return gulp.src('app/pug/*.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('docs'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.scss')
        .pipe(plumber(
            {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
        ))
        .pipe(sass({errLogToConsole: true}))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest('docs/css'))
        .pipe(minify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('docs/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task("jscript", function () {
    gulp.src("app/js/*.js")
        .pipe(plumber())
        .pipe(gulp.dest('docs/js/'))
        .pipe(jsmin())
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest('docs/js/'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', function () {
    return del('docs');
});

gulp.task('copy', function () {
    return gulp.src([
        'app/fonts/**/*.{woff,woff2}',
        'app/libs/**/*.js'
    ], {
        base: 'app'
    })
        .pipe(gulp.dest('docs'))
});

gulp.task('images', function () {
   return gulp.src('app/img/**/*')
       .pipe(imagemin([
           imagemin.optipng({
               optimizationLevel: 3
           }),
           imagemin.jpegtran({
               progressive: true
           }),
           imagemin.svgo()
       ], {
           verbose: true
       }))
       .pipe(gulp.dest('docs/img'))
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'docs'
        },
        notify: false
    });
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/pug/*.pug', ['pug']);
    gulp.watch('app/js/*.js', ['jscript']);
});

gulp.task('develop', function (fn) {
   run(
       'clean',
       'copy',
       'images',
       'pug',
       'sass',
       'jscript',
       fn
   ) ;
});
