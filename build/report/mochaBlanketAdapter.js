
var Base = require('./base')
  , cursor = Base.cursor
  , color = Base.color;

exports = module.exports = BlanketReporter;

/**
 * Author: Geoffroy Warin (http://geowarin.github.io)
 *
 * Adapter reporter to wire blanket from mocha.
 * Essentially taken from https://github.com/alex-seville/blanket/blob/master/src/adapters/mocha-blanket.js
 */

function BlanketReporter(runner) {
  Base.call(this, runner);

    runner.on('start', function() {
        blanket.setupCoverage();
    });

    runner.on('end', function() {
        blanket.onTestsDone();
    });

    runner.on('suite', function() {
        blanket.onModuleStart();
    });

    runner.on('test', function() {
        blanket.onTestStart();
    });

    runner.on('test end', function(test) {
        blanket.onTestDone(test.parent.tests.length, test.state === 'passed');
    });
}
