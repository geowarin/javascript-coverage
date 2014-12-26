var gulp = require('gulp'),
    inject = require('gulp-inject'),
    bowerFiles = require('main-bower-files'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    rename = require('gulp-rename'),
    preprocess = require('gulp-preprocess'),
    argv = require('yargs').argv;

var coverage = !!argv.coverage; // true if --coverage flag is used

gulp.task('processIndex', function () {
    return gulp.src('build/templates/testIndex.html')
        .pipe(preprocess({context: {coverage: coverage}}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('test'));
});

gulp.task('testIndex', ['processIndex'], function () {
    return gulp.src('test/index.html')
        .on('data', processWinPath)
        .pipe(inject(
            gulp.src(bowerFiles({includeDev: true}), {read: false}),
            {name: 'bower', relative: true}
        ))
        .pipe(inject(
            gulp.src(['src/js/**/*.js'], {read: false}),
            {name: 'all', relative: true}
        ))
        .pipe(inject(
            gulp.src(['test/suites/**/*.js'], {read: false}),
            {name: 'suites', relative: true}
        ))
        .pipe(gulp.dest('test'));
});

gulp.task('test', ['testIndex'], function () {
    var options = !coverage ? {} : {
        reporter: 'build/report/mochaBlanketAdapter.js',
        dump: 'test/coverage.html'
    };
    return gulp.src('test/index.html', {read: false})
        .on('data', processWinPath)
        .pipe(mochaPhantomJS(options));
});

var processWinPath = function (file) {
    var path = require('path');
    if (process.platform === 'win32') {
        file.path = path.relative('.', file.path);
    }
};
