/* global Symbol, WeakMap */
/* eslint-disable no-magic-numbers */

"use strict";

var test   = require("tape")
  , fastKey = require("../");

var testObjects = function (t, localFastKey) {
	var obj1 = {}, obj2 = {}, frozenObj = Object.freeze({});

	t.equal(localFastKey(obj1), localFastKey(obj1));
	t.notEqual(localFastKey(obj1), localFastKey(obj2));
	t.notEqual(localFastKey(obj1), localFastKey(frozenObj));
	t.equal(localFastKey(frozenObj), localFastKey(frozenObj));
	t.equal(localFastKey(Function.prototype), localFastKey(Function.prototype));
	t.notEqual(localFastKey(obj1), localFastKey(Function.prototype));
};

test("Primitives", function (t) {
	t.equal(fastKey(), "-");
	t.equal(fastKey(null), "0");
	t.equal(fastKey(true), "11");
	t.equal(fastKey(30), "230");
	t.equal(fastKey("str"), "3str");
	if ((typeof Symbol === "function") && (typeof Symbol.iterator === "symbol")) {
		t.equal(fastKey(Symbol.iterator), Symbol.iterator);
	}
	t.end();
});

test("Objects ES2015+", function (t) {
	if (typeof WeakMap !== "function") {
		// Non ES2015+ env, cannot emulate
		t.end();
		return;
	}
	testObjects(t, fastKey);
	t.end();
});

test("Objects ES5", function (t) {
	var sinon, tweakedFastKey;

	if (typeof WeakMap !== "function") {
		// ES5 environment, run tests naturally
		testObjects(t);
		t.end();
		return;
	}
	if ((typeof __filename !== "string") || !require.cache ||
		(typeof require.resolve !== "function")) {
		// No support for tweaking, no point to run tests
		t.end();
		return;
	}

	sinon = require("sinon");
	sinon.stub(WeakMap.prototype, "get");

	// Reload main modules with characteristics of native WeakMap not being applicable
	delete require.cache[require.resolve("../")];
	delete require.cache[require.resolve("es6-weak-map")];
	tweakedFastKey = require("../");

	if (typeof WeakMap === "function") WeakMap.prototype.get.restore();
	testObjects(t, tweakedFastKey);
	t.end();
});
