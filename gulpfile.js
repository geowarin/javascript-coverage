var gulp = require('gulp'),
    inject = require('gulp-inject'),
    bowerFiles = require('main-bower-files'),
    mochaPhantomJS = require('gulp-mocha-phantomjs'),
    rename = require('gulp-rename'),
    preprocess = require('gulp-preprocess'),
    argv = require('yargs').argv,
    gutil = require('gulp-util');

var coverage = !!argv.coverage; // true if --coverage flag is used

/**
 *  Process test index to interpret the conditions and move it
 *  to the test/ directory
 */
gulp.task('processIndex', function () {
    return gulp.src('build/templates/testIndex.html')
        .pipe(preprocess({context: {coverage: coverage}}))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('test'));
});

/**
 * Inject resources into test index.
 * Please note the file should be in its final position for relative paths to work.
 */
gulp.task('injectIntoIndex', ['processIndex'], function () {
    return gulp.src('test/index.html')
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

/**
 * Launch mocha phantomjs to run the tests.
 * By default, all output is redirected to the console and the spec reporter is used.
 * In coverage mode, output will be redirected to a file and a custom mocha reporter will be used.
 */
gulp.task('test', ['injectIntoIndex'], function () {
    var options = !coverage ? {} : {
        reporter: 'build/report/mochaBlanketAdapter.js',
        dump: 'test/coverage.html'
    };
    return gulp.src('test/index.html', {read: false})
        .on('data', processWinPath)
        .pipe(mochaPhantomJS(options))
        .on('end', function() {
            if (coverage)
                gutil.log('Generated coverage report to', gutil.colors.cyan(options.dump));
        });
});

var processWinPath = function (file) {
    var path = require('path');
    if (process.platform === 'win32') {
        file.path = path.relative('.', file.path);
    }
};
