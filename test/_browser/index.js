"use strict";

var resolve            = require("path").resolve
  , promisify          = require("deferred").promisify
  , unlink             = promisify(require("fs").unlink)
  , runBrowserstack    = promisify(require("browserstack-runner").run)
  , config             = require("./browserstack.json")
  , generateBundle     = require("./generate-bundle")

  , env = process.env;

// eslint-disable-next-line camelcase
config.test_path = resolve(__dirname, "index.html");
config.project = "fast-key";
config.build = env.CIRCLE_TAG || env.CI_PULL_REQUESTS || env.CIRCLE_SHA1;

// Note: BROWSERSTACK_USERNAME and BROWSERSTACK_KEY
// must be set in your environment for test to run succesfully

generateBundle()(function (bundlePath) {
	return runBrowserstack(config)(function (report) {
		process.stdout.write(JSON.stringify(report, null, 2) + "\n");
		return unlink(bundlePath)(function () {
			var failed = [];

			report.forEach(function (testReport) {
				if (testReport.suites.failed) failed.push(testReport.browser);
			});
			if (failed.length) throw new TypeError("Test failed for: " + failed.join(", "));
		});
	});
}).done();
