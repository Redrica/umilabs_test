var gulp = require('gulp'),
    sass = require('gulp-sass'), //Подключаем Sass пакет
    browserSync = require('browser-sync').create(), // Подключаем Browser Sync
    pug = require('gulp-pug'), // Подключаем Pug
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
        .pipe(plumber()) // обработка ошибок без прерывания процесса
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('docs'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/sass/**/*.scss') // Берем все scss файлы из папки sass и дочерних, если таковые будут
        .pipe(plumber(
            {
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }
        ))
        .pipe(sass({errLogToConsole: true})) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(postcss([ autoprefixer() ])) // префиксы, список браузеров в package.json
        .pipe(gulp.dest('docs/css')) // Выгружаем результат в папку app/css
        .pipe(minify()) // минифицируем
        .pipe(rename({
            suffix: '.min'
        })) // добавляем суффикс .min
        .pipe(gulp.dest('docs/css')) // кладем туда же минифицированный файл
        .pipe(browserSync.reload({
            stream: true
        })) // Обновляем CSS на странице при изменении
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
        'app/fonts/**/*.{woff,woff2}'
    ], {
        base: 'app'
    })
        .pipe(gulp.dest('docs'))
        // .pipe(browserSync.reload({
        //     stream: true
        // }))
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

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync.init({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'docs' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('app/sass/**/*.scss', ['sass']); // Наблюдение за sass файлами
    gulp.watch('app/pug/*.pug', ['pug']); // Наблюдение за Pug файлами
    gulp.watch('app/js/*.js', ['jscript']); // Наблюдение за главным JS файлом и за библиотеками

    // Наблюдение за другими типами файлов
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

// gulp.task('watch', ['pug', 'sass', 'browser-sync'], function() {
//     gulp.watch('app/sass/**/*.scss', ['sass']); // Наблюдение за sass файлами
//     gulp.watch('app/*.html', browserSync.reload); // автоперезагрузка html
//     gulp.watch('app/pug/**/*.pug', ['pug'], browserSync.reload); // автоперезагрузка pug
// });

// gulp.task('mytask', function() {
//     console.log('Привет, я таск!');
// });


// function defaultTask(cb) {
//     console.log('place code for your default task here');
//     cb();
// }
//
// function styleTask(cb) {
//     console.log('one more string');
//     cb();
// }
// exports.default = defaultTask;
// exports.style = styleTask;










////////////////////////////// это работает
// const gulp = require('gulp'),
//     pug = require('gulp-pug'),
//     browserSync = require('browser-sync'),
//     sass = require('gulp-sass'); //Подключаем Sass пакет
//
//
// const reload = browserSync.reload;
//
// gulp.task('pug', function() {
//     gulp.src('app/pug/**/*.pug')
//         .pipe(pug({ pretty: true }))
//         .pipe(gulp.dest('app'))
//         .pipe(reload({ stream: true }))
// });
//
// gulp.task('sass', function(){ // Создаем таск Sass
//     return gulp.src('app/sass/**/*.scss') // Берем все scss файлы из папки sass и дочерних, если таковые будут
//         .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
//         .pipe(gulp.dest('app/css')) // Выгружаем результат в папку app/css
//         .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
// });
//
//
// gulp.task('watcher', function () {
//     // gulp.watch('app/pug/**/*.pug', ['pug']);
//     gulp.watch('app/pug/**/*.pug', function () {
//         gulp.start('pug');
//     });
//     gulp.watch('app/sass/**/*.scss', ['sass']);
// });
//
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         server: {
//             baseDir: 'app/'
//         }
//     })
// });
//
// gulp.task('default', ['watcher', 'browser-sync', 'pug', 'sass']);
