/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/admin-map.ts"
/*!*************************!*\
  !*** ./js/admin-map.ts ***!
  \*************************/
() {

eval("{document.addEventListener('DOMContentLoaded', function () {\n  var s = uchAdminMap;\n  mapboxgl.accessToken = s.token;\n  var map = new mapboxgl.Map({\n    container: 'uch-admin-map',\n    style: 'mapbox://styles/mapbox/satellite-streets-v11',\n    center: [parseFloat(s.lng), parseFloat(s.lat)],\n    zoom: s.hasPin ? 14 : 11\n  });\n  map.addControl(new mapboxgl.NavigationControl());\n  var marker = null;\n  function setCoords(lat, lng) {\n    document.getElementById('uch-latitude').value = lat.toFixed(6);\n    document.getElementById('uch-longitude').value = lng.toFixed(6);\n  }\n  function attachDrag(m) {\n    m.on('dragend', function () {\n      var ll = m.getLngLat();\n      setCoords(ll.lat, ll.lng);\n    });\n  }\n  if (s.hasPin) {\n    marker = new mapboxgl.Marker({\n      draggable: true,\n      color: '#11b4da'\n    }).setLngLat([parseFloat(s.lng), parseFloat(s.lat)]).addTo(map);\n    attachDrag(marker);\n  }\n  map.on('click', function (e) {\n    var _e$lngLat = e.lngLat,\n      lat = _e$lngLat.lat,\n      lng = _e$lngLat.lng;\n    if (marker) {\n      marker.setLngLat([lng, lat]);\n    } else {\n      marker = new mapboxgl.Marker({\n        draggable: true,\n        color: '#11b4da'\n      }).setLngLat([lng, lat]).addTo(map);\n      attachDrag(marker);\n    }\n    setCoords(lat, lng);\n  });\n});\n\n//# sourceURL=webpack://mapbox-plugin/./js/admin-map.ts?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	let __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js/admin-map.ts"]();
/******/ 	
/******/ })()
;