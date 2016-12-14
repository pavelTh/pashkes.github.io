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
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var imagemin = require('gulp-imagemin');
var del = require("del");
var run = require('run-sequence');
var fs = require('fs');
var jsmin = require('gulp-jsmin');
var ghPages = require('gulp-gh-pages');
var watch = require('gulp-watch');
gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});
// 1. очистка
gulp.task("clean", function() {
  return del("build");
});
// 2. копирование
gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
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
          "last 2 Opera versions",
          "last 2 Edge versions"
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
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest("build/img"));
});
// 5. символы (SVG)
gulp.task("symbols", function() {
  return gulp.src("build/img/icon/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbol.svg"))
    .pipe(gulp.dest("build/img"));
});

//MINjs
gulp.task('minJs', function () {
    gulp.src('js/*.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/js'));
});
// запуск сборки
gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "symbols",
    "minJs",
    "deploy",
    fn
  );
});
// serv - отслеживание изменений
gulp.task("serve", function() {
  server.init({
    server: "build"
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

// 5. символы (SVG)
gulp.task("svgloc", function() {
  return gulp.src("img/icon/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbol.svg"))
    .pipe(gulp.dest("img"));
});

// Локальная сборка стилей
gulp.task("stylelocal", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([]))
    .pipe(gulp.dest("css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"));
});
gulp.task("ls", function() {
  server.init({
    server: "."
  });

  gulp.watch("sass/**/*.{scss,sass}", ["stylelocal", server.reload]);
  gulp.watch("*.html").on("change", server.reload);
});