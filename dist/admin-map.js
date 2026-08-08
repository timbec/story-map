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

/***/ "./js/admin-map.ts"
/*!*************************!*\
  !*** ./js/admin-map.ts ***!
  \*************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mapbox-gl */ \"mapbox-gl\");\n/* harmony import */ var mapbox_gl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mapbox_gl__WEBPACK_IMPORTED_MODULE_0__);\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  var s = uchAdminMap;\n  mapbox_gl__WEBPACK_IMPORTED_MODULE_0__.accessToken = s.token;\n  var map = new mapbox_gl__WEBPACK_IMPORTED_MODULE_0__.Map({\n    container: 'uch-admin-map',\n    style: 'mapbox://styles/mapbox/satellite-streets-v11',\n    center: [parseFloat(s.lng), parseFloat(s.lat)],\n    zoom: s.hasPin ? 14 : 11\n  });\n  map.addControl(new mapbox_gl__WEBPACK_IMPORTED_MODULE_0__.NavigationControl());\n  var marker = null;\n  function setCoords(lat, lng) {\n    document.getElementById('uch-latitude').value = lat.toFixed(6);\n    document.getElementById('uch-longitude').value = lng.toFixed(6);\n  }\n  function attachDrag(m) {\n    m.on('dragend', function () {\n      var ll = m.getLngLat();\n      setCoords(ll.lat, ll.lng);\n    });\n  }\n  if (s.hasPin) {\n    marker = new mapbox_gl__WEBPACK_IMPORTED_MODULE_0__.Marker({\n      draggable: true,\n      color: '#11b4da'\n    }).setLngLat([parseFloat(s.lng), parseFloat(s.lat)]).addTo(map);\n    attachDrag(marker);\n  }\n  map.on('click', function (e) {\n    var _e$lngLat = e.lngLat,\n      lat = _e$lngLat.lat,\n      lng = _e$lngLat.lng;\n    if (marker) {\n      marker.setLngLat([lng, lat]);\n    } else {\n      marker = new mapbox_gl__WEBPACK_IMPORTED_MODULE_0__.Marker({\n        draggable: true,\n        color: '#11b4da'\n      }).setLngLat([lng, lat]).addTo(map);\n      attachDrag(marker);\n    }\n    setCoords(lat, lng);\n  });\n});\n\n//# sourceURL=webpack://mapbox-plugin/./js/admin-map.ts?\n}");

/***/ },

/***/ "mapbox-gl"
/*!***************************!*\
  !*** external "mapboxgl" ***!
  \***************************/
(module) {

module.exports = mapboxgl;

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
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
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
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
/******/ 			if(Symbol.toStringTag) {
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
/******/ 	let __webpack_exports__ = __webpack_require__("./js/admin-map.ts");
/******/ 	
/******/ })()
;