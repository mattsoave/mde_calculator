const gulp = require('gulp');
const babel = require('gulp-babel');
const rename = require ('gulp-rename');
const uglify = require('gulp-uglify');

const SRC = "./src";
const DEST = "./build";
 
gulp.task('babel', () => {
    return gulp.src(SRC + '/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./build/js'));
});

// Save a copy of the original, then a minified copy of the babel-ified version
gulp.task("js", function() {
    return gulp.src(SRC + '/js/*.js')
        .pipe(gulp.dest(DEST + '/js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(DEST + '/js'))
        .pipe(uglify())
        .pipe(rename({ extname: ".min.js"}))
        .pipe(gulp.dest(DEST + '/js'));
});

gulp.task("react", function() {
    return gulp.src(SRC + "/js/*.jsx")
        .pipe(babel({
            plugins: ['transform-react-jsx']
        }))
        .pipe(gulp.dest(SRC + "/js"));
});