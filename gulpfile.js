const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require ('gulp-rename');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');

const JS_SRC = "./js/src";
const JS_DEST = "./js/build";
 
// Save a copy of the original, then a minified copy of the babel-ified version
gulp.task("js", function() {
    return gulp.src(JS_SRC + '/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(JS_DEST))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js"}))
        .pipe(gulp.dest(JS_DEST));
});




gulp.task('css', function () {
  return gulp.src('./css/src/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css/build'));
});