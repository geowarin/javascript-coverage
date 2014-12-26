var gulp = require('gulp'),
    inject = require('gulp-inject'),
    bowerFiles = require('main-bower-files'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    rename = require('gulp-rename');


gulp.task('testIndex', function () {
    var target = gulp.src('templates/testIndex.html');

    return target
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
        .pipe(rename('index.html'))
        .pipe(gulp.dest('test'));
});

gulp.task('test', ['testIndex'], function () {
    return gulp.src('test/index.html', {read: false})
        .on('data', processWinPath)
        .pipe(mochaPhantomJS());
});

gulp.task('coverage', ['testIndexCoverage'], function () {
    return gulp.src('templates/index.html', {read: false})
        .on('data', processWinPath)
        .pipe(mochaPhantomJS({
            reporter: 'report/mochaBlanketReporter.js',
            dump: 'test/coverage.html'
        }));
});

var processWinPath = function (file) {
    var path = require('path');
    if (process.platform === 'win32') {
        file.path = path.relative('.', file.path);
    }
};
