"use strict";

var resolve           = require("path").resolve
  , createWriteStream = require("fs").createWriteStream
  , Browserify        = require("browserify")
  , Deferred          = require("deferred")

	, clientProgramPath = resolve(__dirname, "client-program.js")
  , bundlePath = resolve(__dirname, "test.bundle.js");

module.exports = function () {
	var browserify = new Browserify(), deferred = new Deferred(), bundle;

	browserify.add(clientProgramPath);
	bundle = browserify.bundle();
	bundle.pipe(createWriteStream(bundlePath));
	bundle.on("error", deferred.reject);
	bundle.on("end", deferred.resolve.bind(null, bundlePath));
	return deferred.promise;
};

if (require.main === module) module.exports().done();
