"use strict";
// переменные (модули)
var gulp = require("gulp");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var mqpacker = require("css-mqpacker");
var minify = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var del = require("del");
var run = require('run-sequence');
var fs = require('fs');
var ghPages = require('gulp-gh-pages');
// 1. очистка
gulp.task("clean", function() {
    return del("build");
});
// 2. копирование
gulp.task("copy", function() {
    return gulp.src([
            "fonts/**/*.{woff,eot,otf,woff2}",
            "img/**",
            "js/**",
            "*.html"
        ], {
            base: "."
        })
        .pipe(gulp.dest("build"));
});
// 3. сборка стилей
gulp.task("style", function() {
    gulp.src("sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    "last 1 version",
                    "last 2 Chrome versions",
                    "last 2 Firefox versions",
                    "last 2 Opera versions"
                ]
            }),
            mqpacker({
                sort: false
            })
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"));
});
// 4. картинк
gulp.task("images", function() {
    return gulp.src("build/img/**/*.{png,jpg,gif}")
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 4 }),
            imagemin.jpegtran({ progressive: 60 })
        ]))
        .pipe(gulp.dest("build/img"));
});
// запуск сборки
gulp.task("build", function(fn) {
    run(
        "clean",
        "copy",
        "style",
        "images",
        "deploy",
        fn
    );
});
// Генератор страниц на GitHub 
gulp.task('deploy', function() {
    return gulp.src("build/**/*")
        .pipe(ghPages());
});
// serv - отслеживание изменений
gulp.task("serve", function() {
    server.init({
        server: "build"
    });

    gulp.watch("sass/**/*.{scss,sass}", ["style"]);
    gulp.watch("*.html").on("change", server.reload);
});
// Локальная сборка стилей
gulp.task("stylelocal", function() {
    gulp.src("sass/style.scss")
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    "last 1 version",
                    "last 2 Chrome versions",
                    "last 2 Firefox versions"
                ]
            })
        ]))
        .pipe(gulp.dest("css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("css"));
});


gulp.task("ls", function() {
    server.init({
        server: ".",
        notify: false
    });

    gulp.watch("sass/**/*.{scss,sass}", ["stylelocal", server.reload]);
    gulp.watch("*.html").on("change", server.reload);
});
