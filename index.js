"use strict";

var WeakMap = require("es6-weak-map")

  , objMap = new WeakMap(), idIndex = 0
  , nonExtensibleObjects, nonExtensibleIds;

var mapExtensibleOnly = (function () {
	var map = new WeakMap(), obj = Object.freeze({});

	try {
		map.set(obj, true);
		return map.get(obj) !== true;
	} catch (e) {
		return true;
	}
}());

if (mapExtensibleOnly) {
	nonExtensibleObjects = [];
	nonExtensibleIds = [];
}

var setObjectId = function (value) {
	var isMapHandled = !mapExtensibleOnly || Object.isExtensible(value)
	  , id, nonExtensibleIndex;

	if (!isMapHandled) {
		nonExtensibleIndex = nonExtensibleObjects.indexOf(value);
		if (nonExtensibleIndex !== -1) return nonExtensibleIds[nonExtensibleIndex];
	}
	id = "7" + ++idIndex;
	if (isMapHandled) {
		objMap.set(value, id);
	} else {
		nonExtensibleObjects.push(value);
		nonExtensibleIds.push(id);
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
	default: throw new TypeError("Not supported value type");
	}
};
