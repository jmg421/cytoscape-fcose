/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fcose"] = factory();
	else
		root["fcose"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction _typeof(o) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o; }, _typeof(o); }\nfunction _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError(\"Cannot call a class as a function\"); }\nfunction _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, \"value\" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }\nfunction _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, \"prototype\", { writable: !1 }), e; }\nfunction _toPropertyKey(t) { var i = _toPrimitive(t, \"string\"); return \"symbol\" == _typeof(i) ? i : i + \"\"; }\nfunction _toPrimitive(t, r) { if (\"object\" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || \"default\"); if (\"object\" != _typeof(i)) return i; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (\"string\" === r ? String : Number)(t); }\n/**\n * Minimal fcose layout plugin for Cytoscape.\n *\n * In a real implementation, you would include your layout algorithm code.\n * Here we provide a refined implementation to demonstrate proper structure.\n */\n/**\n * Define the FcoseLayout as a proper class to be used as a constructor.\n */\nvar FcoseLayout = /*#__PURE__*/function () {\n  function FcoseLayout(options) {\n    _classCallCheck(this, FcoseLayout);\n    this.options = options;\n  }\n  return _createClass(FcoseLayout, [{\n    key: \"run\",\n    value: function run() {\n      var cy = this.options.cy;\n      // Use the provided element collection, if available\n      var nodes = this.options.eles ? this.options.eles.nodes() : cy.nodes();\n      // If no nodes are available, notify that the layout is done and exit gracefully.\n      if (nodes.length === 0) {\n        if (this.options.done) {\n          this.options.done();\n        }\n        return;\n      }\n\n      // Begin a batch update for smoother rendering.\n      cy.startBatch();\n      var spacing = 100;\n      var row = 0;\n      var col = 0;\n      nodes.forEach(function (node) {\n        var posX = col * spacing + 50;\n        var posY = row * spacing + 50;\n        node.position({\n          x: posX,\n          y: posY\n        });\n        col++;\n        if (col >= 5) {\n          col = 0;\n          row++;\n        }\n      });\n      cy.endBatch();\n      // Adjust the viewport so all nodes are visible.\n      cy.fit();\n      if (this.options.done) {\n        this.options.done();\n      }\n    }\n  }, {\n    key: \"stop\",\n    value: function stop() {\n      // Provide functionality for stopping the layout if necessary.\n    }\n\n    // Dummy event methods to support Cytoscape's API:\n  }, {\n    key: \"on\",\n    value: function on() {}\n  }, {\n    key: \"one\",\n    value: function one() {}\n  }, {\n    key: \"off\",\n    value: function off() {}\n  }, {\n    key: \"trigger\",\n    value: function trigger() {}\n  }]);\n}();\n/**\n * Register the layout with Cytoscape.\n * Cytoscape will call this registration function (once imported by cytoscape.use())\n * passing the cytoscape instance. The plugin then registers the 'fcose' layout,\n * which Cytoscape instantiates using new FcoseLayout(options)\n */\nfunction register(cytoscape) {\n  if (!cytoscape) {\n    console.error(\"Cytoscape is not defined\");\n    return;\n  }\n  cytoscape('layout', 'fcose', FcoseLayout);\n  console.log(\"fcose layout registered\");\n}\n\n// Export the registration function as the default export\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (register);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});