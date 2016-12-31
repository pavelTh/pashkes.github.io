"use strict";

var gulp = require("gulp"),
  rename = require("gulp-rename"),
  plumber = require("gulp-plumber"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  browserSync = require('browser-sync').create(),
  mqpacker = require("css-mqpacker"),
  minify = require('gulp-csso'),
  svgmin = require('gulp-svgmin'),
  svgstore = require('gulp-svgstore'),
  imagemin = require('gulp-imagemin'),
  del = require("del"),
  run = require('run-sequence'),
  fs = require('fs'),
  jsmin = require('gulp-jsmin'),
  ghPages = require('gulp-gh-pages');

// 1. Clean
gulp.task("clean", function() {
  return del("build");
});

// 2. Copy
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

// 3. Style 
gulp.task("style", function() {
  return gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 1 version",
          "last 2 Chrome versions",
          "last 2 Firefox versions",
          "last 2 Opera versions",
          "last 2 Edge versions",
          "last 12 IOS version"
        ]
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

// 4. Images
gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.jpegtran({ progressive: true })
    ]))
    .pipe(gulp.dest("build/img"));
});

// 5. Symbol (SVG)
gulp.task("symbols", function() {
  return gulp.src("build/img/icon/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbol.svg"))
    .pipe(gulp.dest("build/img"));
});

// 6. Js
gulp.task('minJs', function() {
  gulp.src('js/*.js')
    .pipe(jsmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('build/js'));
});

//7. deploy github
gulp.task('deploy', function() {
  return gulp.src('build/**/*')
    .pipe(ghPages());
});

// Watch build change
gulp.task("serve", function() {
  browserSync.init({
    server: "build"
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style", browserSync.reload]);
  gulp.watch("*.html").on("change", browserSync.reload);
});

// Start assembly
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

//Symbol local
gulp.task("svgloc", function() {
  return gulp.src("img/icon/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbol.svg"))
    .pipe(gulp.dest("img"));
});

// local server
gulp.task('serve', ['sass'], function() {
    
  browserSync.init({
    server: "."
  });

  gulp.watch("sass/**/*.scss", ['sass', browserSync.reload]);
  gulp.watch("*.html").on('change', browserSync.reload);
});

// local compile sass
gulp.task('sass', function() {
  return gulp.src("sass/style.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 1 version",
          "last 2 Chrome versions",
          "last 2 Firefox versions",
          "last 2 Opera versions",
          "last 2 Edge versions",
          "last 12 IOS version"
        ]
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("css"))
    .pipe(browserSync.stream());
});

//default gulp task
gulp.task('default', [
  'deploy',
  'clean',
  'copy',
  'style',
  'images',
  'symbols',
  'minJs',
  'build',
  'svgloc',
  'serve',
  'sass'
]);