/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./demo/main.js":
/*!**********************!*\
  !*** ./demo/main.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _src_cygraph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../src/cygraph.js */ \"./src/cygraph.js\");\n/* harmony import */ var _src_ui_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/ui.js */ \"./src/ui.js\");\n/* harmony import */ var _src_entityIdUtils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../src/entityIdUtils.js */ \"./src/entityIdUtils.js\");\n\n\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  (0,_src_cygraph_js__WEBPACK_IMPORTED_MODULE_0__.initCy)().then(function (cy) {\n    // Retrieve current data for nodes and edges from the Cytoscape instance.\n    var nodesData = cy.nodes().map(function (node) {\n      return node.data();\n    });\n    var edgesData = cy.edges().map(function (edge) {\n      return edge.data();\n    });\n\n    // Create a structured object for assignEntityIds.\n    var elementsData = {\n      nodes: nodesData,\n      edges: edgesData\n    };\n\n    // Generate and log missing entity IDs.\n    (0,_src_entityIdUtils_js__WEBPACK_IMPORTED_MODULE_2__.assignEntityIds)(elementsData);\n\n    // Update Cytoscape elements with the modified data containing IDs.\n    cy.nodes().forEach(function (node, index) {\n      node.data(elementsData.nodes[index]);\n    });\n    cy.edges().forEach(function (edge, index) {\n      edge.data(elementsData.edges[index]);\n    });\n\n    // Continue with UI initialization using the imported function.\n    (0,_src_ui_js__WEBPACK_IMPORTED_MODULE_1__.initializeUI)(cy);\n  });\n});\n\n//# sourceURL=webpack:///./demo/main.js?");

/***/ }),

/***/ "./src/cygraph.js":
/*!************************!*\
  !*** ./src/cygraph.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   cy: () => (/* binding */ cy),\n/* harmony export */   initCy: () => (/* binding */ initCy),\n/* harmony export */   refreshGraphData: () => (/* binding */ refreshGraphData),\n/* harmony export */   updateLayout: () => (/* binding */ updateLayout)\n/* harmony export */ });\n/* harmony import */ var cytoscape__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cytoscape */ \"cytoscape\");\n/* harmony import */ var cytoscape__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cytoscape__WEBPACK_IMPORTED_MODULE_0__);\n\nvar cy = null; // This will hold the Cytoscape instance\n\nfunction initCy() {\n  return fetch('/graph_data').then(function (response) {\n    if (!response.ok) {\n      return response.text().then(function (text) {\n        throw new Error(\"HTTP Error \".concat(response.status, \": \").concat(text));\n      });\n    }\n    return response.json();\n  }).then(function (data) {\n    cy = cytoscape__WEBPACK_IMPORTED_MODULE_0___default()({\n      container: document.getElementById('cy'),\n      boxSelectionEnabled: true,\n      autounselectify: false,\n      elements: data,\n      style: [{\n        selector: 'node',\n        style: {\n          'content': 'data(label)',\n          'background-color': '#0074D9',\n          'color': '#fff',\n          'text-valign': 'center',\n          'font-size': '10px'\n        }\n      }, {\n        selector: 'edge',\n        style: {\n          'content': 'data(label)',\n          'width': 2,\n          'line-color': '#ccc',\n          'target-arrow-shape': 'triangle',\n          'target-arrow-color': '#ccc',\n          'curve-style': 'bezier',\n          'font-size': '10px',\n          'color': '#000',\n          'text-rotation': 'autorotate',\n          'text-margin-y': -5\n        }\n      }, {\n        selector: 'node:selected',\n        style: {\n          'background-color': '#f00',\n          'border-width': '4px',\n          'border-color': '#FFA500'\n        }\n      }, {\n        selector: 'edge:selected',\n        style: {\n          'line-color': '#f00',\n          'target-arrow-color': '#f00',\n          'width': 4\n        }\n      }, {\n        selector: 'node:active',\n        style: {\n          'background-color': '#f00',\n          'border-width': '4px',\n          'border-color': '#FFA500'\n        }\n      }, {\n        selector: 'edge:active',\n        style: {\n          'line-color': '#f00',\n          'target-arrow-color': '#f00',\n          'width': 4\n        }\n      }],\n      layout: {\n        name: 'fcose',\n        animate: true\n      }\n    });\n\n    // Node selection events:\n    cy.on('tap', 'node', function (evt) {\n      var node = evt.target;\n      if (!node.selected()) {\n        node.select();\n      }\n    });\n    cy.on('tapend', 'node', function (evt) {\n      var node = evt.target;\n      if (!node.selected()) {\n        node.select();\n      }\n    });\n\n    // Edge selection events:\n    cy.on('tap', 'edge', function (evt) {\n      var edge = evt.target;\n      if (!edge.selected()) {\n        edge.select();\n      }\n    });\n    cy.on('tapend', 'edge', function (evt) {\n      var edge = evt.target;\n      if (!edge.selected()) {\n        edge.select();\n      }\n    });\n    return cy;\n  })[\"catch\"](function (error) {\n    console.error('Error initializing Cytoscape:', error);\n  });\n}\nfunction updateLayout() {\n  if (cy) {\n    var layout = cy.layout({\n      name: 'fcose',\n      animate: true\n    });\n    layout.run();\n    cy.fit();\n  }\n}\nfunction refreshGraphData() {\n  if (!cy) return;\n  fetch('/graph_data').then(function (response) {\n    if (!response.ok) {\n      return response.text().then(function (text) {\n        throw new Error(\"HTTP Error \".concat(response.status, \": \").concat(text));\n      });\n    }\n    return response.json();\n  }).then(function (data) {\n    cy.json({\n      elements: data\n    });\n    updateLayout();\n  })[\"catch\"](function (error) {\n    console.error('Error refreshing graph data:', error);\n  });\n}\n\n//# sourceURL=webpack:///./src/cygraph.js?");

/***/ }),

/***/ "./src/entityIdUtils.js":
/*!******************************!*\
  !*** ./src/entityIdUtils.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   assignEntityIds: () => (/* binding */ assignEntityIds)\n/* harmony export */ });\n/**\n * Utility functions for generating and assigning unique IDs to graph entities.\n */\n\n/**\n * Generate a unique entity id using a prefix (\"node\" or \"edge\") and a random string.\n * @param {string} prefix - The prefix for the entity id.\n * @returns {string} - The generated unique id.\n */\nfunction generateEntityId(prefix) {\n  return prefix + '-' + Math.random().toString(36).substr(2, 9);\n}\n\n/**\n * Assign unique IDs to nodes and edges if not already present.\n * Logs the generated IDs in the JavaScript console.\n * If the element's data is undefined, it safely skips that element.\n * Optionally, if the `label` field is missing, a default (empty) label is set.\n * @param {object} elements - The elements object with `nodes` and `edges` arrays.\n * @returns {object} - The modified elements object with IDs assigned.\n */\nfunction assignEntityIds(elements) {\n  if (elements.nodes && Array.isArray(elements.nodes)) {\n    elements.nodes.forEach(function (nodeData) {\n      if (!nodeData) return; // In case the node data is undefined\n      if (!nodeData.hasOwnProperty('id')) {\n        var id = generateEntityId('node');\n        nodeData.id = id;\n        console.log(\"Generated node id:\", id);\n      }\n      // Ensure each node has a defined label; this helps avoid style warnings.\n      if (!nodeData.hasOwnProperty('label')) {\n        nodeData.label = \"\";\n      }\n    });\n  }\n  if (elements.edges && Array.isArray(elements.edges)) {\n    elements.edges.forEach(function (edgeData) {\n      if (!edgeData) return; // Guard if the edge data is undefined\n      if (!edgeData.hasOwnProperty('id')) {\n        var id = generateEntityId('edge');\n        edgeData.id = id;\n        console.log(\"Generated edge id:\", id);\n      }\n      // Ensure each edge has a defined label.\n      if (!edgeData.hasOwnProperty('label')) {\n        edgeData.label = \"\";\n      }\n    });\n  }\n  return elements;\n}\n\n\n//# sourceURL=webpack:///./src/entityIdUtils.js?");

/***/ }),

/***/ "./src/ui.js":
/*!*******************!*\
  !*** ./src/ui.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initializeUI: () => (/* binding */ initializeUI)\n/* harmony export */ });\n/* harmony import */ var _cygraph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cygraph.js */ \"./src/cygraph.js\");\n\n\n// Helper function to generate a unique id.\nfunction generateUniqueId(prefix) {\n  return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);\n}\nfunction updateEdgeModalDropdown() {\n  var sourceSelect = document.getElementById('edge-source-select');\n  var targetSelect = document.getElementById('edge-target-select');\n\n  // If either dropdown doesn't exist, log a warning and exit.\n  if (!sourceSelect || !targetSelect) {\n    console.warn('Edge modal dropdown element(s) not found. ' + 'Make sure your Add Edge modal contains <select> elements with ' + 'ids \"edge-source-select\" and \"edge-target-select\".');\n    return;\n  }\n\n  // Clear existing options and add a default placeholder option.\n  [sourceSelect, targetSelect].forEach(function (select) {\n    select.innerHTML = \"<option value=\\\"\\\">Select a node</option>\";\n  });\n\n  // Get the current nodes from the Cytoscape instance.\n  var nodes = _cygraph_js__WEBPACK_IMPORTED_MODULE_0__.cy.nodes();\n  nodes.forEach(function (node) {\n    var nodeId = node.data('id');\n    var nodeLabel = node.data('label') || nodeId;\n    var optionHTML = \"<option value=\\\"\".concat(nodeId, \"\\\">\").concat(nodeLabel, \"</option>\");\n    sourceSelect.insertAdjacentHTML(\"beforeend\", optionHTML);\n    targetSelect.insertAdjacentHTML(\"beforeend\", optionHTML);\n  });\n}\n\n/**\n * Initialize the application's UI by attaching event listeners to DOM elements.\n * This version verifies that each expected element exists before proceeding.\n */\nfunction initializeUI(cy) {\n  // Open the Add Node modal.\n  var addNodeBtn = document.getElementById('add-node-btn');\n  if (addNodeBtn) {\n    addNodeBtn.addEventListener('click', function () {\n      // Reset the form (the node id field is not present now)\n      document.getElementById('add-node-form').reset();\n      var addNodeModal = new bootstrap.Modal(document.getElementById('addNodeModal'));\n      addNodeModal.show();\n    });\n  } else {\n    console.warn(\"Element 'add-node-btn' not found in the DOM.\");\n  }\n\n  // Open the Add Edge modal.\n  var addEdgeBtn = document.getElementById('add-edge-btn');\n  if (addEdgeBtn) {\n    addEdgeBtn.addEventListener('click', function () {\n      document.getElementById('add-edge-form').reset();\n      updateEdgeModalDropdown();\n      var addEdgeModal = new bootstrap.Modal(document.getElementById('addEdgeModal'));\n      addEdgeModal.show();\n    });\n  } else {\n    console.warn(\"Element 'add-edge-btn' not found in the DOM.\");\n  }\n\n  // Create edge from exactly 2 selected nodes.\n  var createEdgeBtn = document.getElementById('create-edge-btn');\n  if (createEdgeBtn) {\n    createEdgeBtn.addEventListener('click', function () {\n      var selectedNodes = cy.$('node:selected');\n      if (selectedNodes.length !== 2) {\n        alert(\"Please select exactly 2 nodes to create an edge.\");\n        return;\n      }\n      var source = selectedNodes[0].data('id');\n      var target = selectedNodes[1].data('id');\n      var edgeId = generateUniqueId('edge');\n      var edgeLabel = \"\".concat(source, \"\\u2192\").concat(target);\n      var payload = {\n        id: edgeId,\n        source: source,\n        target: target,\n        label: edgeLabel\n      };\n      fetch('/api/add_edge', {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify(payload)\n      }).then(function (response) {\n        if (!response.ok) {\n          return response.text().then(function (text) {\n            throw new Error(\"HTTP Error \".concat(response.status, \": \").concat(text));\n          });\n        }\n        return response.json();\n      }).then(function (result) {\n        if (result.status === 'success') {\n          (0,_cygraph_js__WEBPACK_IMPORTED_MODULE_0__.refreshGraphData)();\n        } else {\n          alert(\"Error: \" + result.message);\n        }\n      })[\"catch\"](function (error) {\n        console.error(\"Error creating edge:\", error);\n      });\n    });\n  } else {\n    console.warn(\"Element 'create-edge-btn' not found in the DOM.\");\n  }\n\n  // Remove selected elements (nodes and edges).\n  var removeSelectedBtn = document.getElementById('remove-selected-btn');\n  if (removeSelectedBtn) {\n    removeSelectedBtn.addEventListener('click', function () {\n      var selected = cy.$(':selected');\n      if (selected.length === 0) {\n        alert(\"Please select nodes or edges to remove.\");\n        return;\n      }\n      var ids = selected.map(function (ele) {\n        return ele.data('id');\n      });\n      fetch('/api/remove_elements', {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n          ids: ids\n        })\n      }).then(function (response) {\n        if (!response.ok) {\n          return response.text().then(function (text) {\n            throw new Error(\"HTTP Error \".concat(response.status, \": \").concat(text));\n          });\n        }\n        return response.json();\n      }).then(function (result) {\n        if (result.status === 'success') {\n          (0,_cygraph_js__WEBPACK_IMPORTED_MODULE_0__.refreshGraphData)();\n        } else {\n          alert(\"Error: \" + result.message);\n        }\n      })[\"catch\"](function (error) {\n        console.error(\"Error removing elements:\", error);\n      });\n    });\n  } else {\n    console.warn(\"Element 'remove-selected-btn' not found in the DOM.\");\n  }\n\n  // Handle Add Node form submission.\n  var addNodeForm = document.getElementById('add-node-form');\n  if (addNodeForm) {\n    addNodeForm.addEventListener('submit', function (evt) {\n      evt.preventDefault();\n\n      // Automatically generate a new node id.\n      var nodeId = generateUniqueId('node');\n      var nodeLabel = document.getElementById('node-label').value.trim() || nodeId;\n      var nodePosVal = document.getElementById('node-position').value.trim();\n      var position = null;\n      if (nodePosVal) {\n        var coords = nodePosVal.split(',');\n        if (coords.length === 2) {\n          position = {\n            x: parseFloat(coords[0].trim()),\n            y: parseFloat(coords[1].trim())\n          };\n        }\n      }\n      var payload = {\n        id: nodeId,\n        label: nodeLabel\n      };\n      if (position) {\n        payload.position = position;\n      }\n      fetch('/api/add_node', {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify(payload)\n      }).then(function (response) {\n        if (!response.ok) {\n          return response.text().then(function (text) {\n            throw new Error(\"HTTP Error \".concat(response.status, \": \").concat(text));\n          });\n        }\n        return response.json();\n      }).then(function (result) {\n        if (result.status === 'success') {\n          (0,_cygraph_js__WEBPACK_IMPORTED_MODULE_0__.refreshGraphData)();\n        } else {\n          alert(\"Error: \" + result.message);\n        }\n      })[\"catch\"](function (error) {\n        console.error(\"Error adding node:\", error);\n      })[\"finally\"](function () {\n        var addNodeModal = bootstrap.Modal.getInstance(document.getElementById('addNodeModal'));\n        if (addNodeModal) {\n          addNodeModal.hide();\n        }\n      });\n    });\n  } else {\n    console.warn(\"Element 'add-node-form' not found in the DOM.\");\n  }\n\n  // Handle Add Edge form submission.\n  var addEdgeForm = document.getElementById('add-edge-form');\n  if (addEdgeForm) {\n    addEdgeForm.addEventListener('submit', function (evt) {\n      evt.preventDefault();\n      var edgeId = generateUniqueId('edge');\n      var edgeSource = document.getElementById('edge-source-select').value;\n      var edgeTarget = document.getElementById('edge-target-select').value;\n      var edgeLabel = document.getElementById('edge-label').value.trim() || \"\".concat(edgeSource, \"\\u2192\").concat(edgeTarget);\n      if (!edgeSource || !edgeTarget) {\n        alert(\"Please select both a source and a target node.\");\n        return;\n      }\n      var payload = {\n        id: edgeId,\n        source: edgeSource,\n        target: edgeTarget,\n        label: edgeLabel\n      };\n      fetch('/api/add_edge', {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify(payload)\n      }).then(function (response) {\n        if (!response.ok) {\n          return response.text().then(function (text) {\n            throw new Error(\"HTTP Error \".concat(response.status, \": \").concat(text));\n          });\n        }\n        return response.json();\n      }).then(function (result) {\n        if (result.status === 'success') {\n          (0,_cygraph_js__WEBPACK_IMPORTED_MODULE_0__.refreshGraphData)();\n        } else {\n          alert(\"Error: \" + result.message);\n        }\n      })[\"catch\"](function (error) {\n        console.error(\"Error adding edge:\", error);\n      })[\"finally\"](function () {\n        var addEdgeModal = bootstrap.Modal.getInstance(document.getElementById('addEdgeModal'));\n        if (addEdgeModal) {\n          addEdgeModal.hide();\n        }\n      });\n    });\n  } else {\n    console.warn(\"Element 'add-edge-form' not found in the DOM.\");\n  }\n  console.log(\"UI initialized\");\n}\n\n//# sourceURL=webpack:///./src/ui.js?");

/***/ }),

/***/ "cytoscape":
/*!****************************!*\
  !*** external "cytoscape" ***!
  \****************************/
/***/ ((module) => {

module.exports = cytoscape;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__("./demo/main.js");
/******/ 	
/******/ })()
;