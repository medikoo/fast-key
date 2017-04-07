"use strict";

var WeakMap = require("es6-weak-map")

  , objMap = new WeakMap(), idIndex = 0, frozenObjects = [], frozenIds =  [];

var setObjectId = function (value) {
	var id, frozenIndex;

	if (Object.isExtensible(value)) {
		id = "7" + ++idIndex;
		objMap.set(value, id);
	} else {
		frozenIndex = frozenObjects.indexOf(value);
		if (frozenIndex !== -1) return frozenIds[frozenIndex];
		id = "7" + ++idIndex;
		frozenObjects.push(value);
		frozenIds.push(id);
	}
	return id;
};

module.exports = function (value) {
	switch (typeof value) {
	case "undefined": return "-";
	case "boolean": return "1" + Number(value);
	case "number": return "2" + value;
	case "string": return "3" + value;
	case "symbol": return value;
	case "object":
		if (value === null) return "0";
		// Falls through
	case "function":
		return objMap.get(value) || setObjectId(value);
	/* istanbul ignore next */
	default: throw new TypeError("Not supported value type");
	}
};
