/* global Symbol */

"use strict";

var test    = require("tape")
  , fastKey = require("../");

test("Output", function (t) {
	var obj1 = {}, obj2 = {}, frozenObj = Object.freeze({}), fn = function () {};

	t.equal(fastKey(), "-");
	t.equal(fastKey(null), "0");
	t.equal(fastKey(true), "11");
	t.equal(fastKey(30), "230");
	t.equal(fastKey("str"), "3str");
	if ((typeof Symbol === "function") && (typeof Symbol.iterator === "symbol")) {
		t.equal(fastKey(Symbol.iterator), Symbol.iterator);
	}
	t.equal(fastKey(obj1), fastKey(obj1));
	t.notEqual(fastKey(obj1), fastKey(obj2));
	t.notEqual(fastKey(obj1), fastKey(frozenObj));
	t.equal(fastKey(frozenObj), fastKey(frozenObj));
	t.equal(fastKey(fn), fastKey(fn));
	t.notEqual(fastKey(obj1), fastKey(fn));
	t.end();
});
