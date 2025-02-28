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

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _view_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view/eventListeners.js */ \"./src/js/view/eventListeners.js\");\n/* harmony import */ var _view_manual_data_counters_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view/manual_data/counters.js */ \"./src/js/view/manual_data/counters.js\");\n\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n    _view_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__.initializeEventListeners();\n    _view_manual_data_counters_js__WEBPACK_IMPORTED_MODULE_1__.initializeEventListeners();\n});\n\n\n//# sourceURL=webpack:///./src/js/app.js?");

/***/ }),

/***/ "./src/js/controller/dataProcessors.js":
/*!*********************************************!*\
  !*** ./src/js/controller/dataProcessors.js ***!
  \*********************************************/
/***/ ((module) => {

eval("function processData(offset, key, include, studentData) {\n    const totalPossibleScore = calculateTotalPossibleScore(include);\n    const scores = getScores(studentData.split('\\n'), key, include, offset);\n    return {\n        totalPossibleScore,\n        scores\n    };\n}\n\nfunction validateInputs(key, options, include, numberOfItems) {\n    if (key.length !== numberOfItems || options.length !== numberOfItems || include.length !== numberOfItems) {\n        alert('Key, Options, and Include lengths must match the number of Test Items.');\n        return false;\n    }\n    return true;\n}\n\nfunction calculateSkewness(scores, n, mean, stdDev) {\n    return scores.reduce((acc, score) => acc + Math.pow(score - mean, 3), 0) / (n * Math.pow(stdDev, 3));\n}\n\nfunction calculateKurtosis(scores, n, mean, stdDev) {\n    return scores.reduce((acc, score) => acc + Math.pow(score - mean, 4), 0) / (n * Math.pow(stdDev, 4));\n}\n\nfunction calculateTotalPossibleScore(include) {\n    if (typeof include !== 'string') {\n        return 0;\n    }\n    return include.split('').reduce((acc, val) => val.toLowerCase() === 'y' ? acc + 1 : acc, 0);\n}\n\nfunction getScores(data, key, include, offset) {\n    if (!Array.isArray(data)) {\n        data = data.split('\\n');\n    }\n    const scores = data.map(line => calculateScore(line, key, include, offset));\n    return scores;\n}\n\nfunction calculateScore(line, key, include, offset) {\n    line = line.slice(offset);\n    let score = 0;\n    for (let i = 0; i < key.length; i++) {\n        if (include[i].toLowerCase() === 'y' && line[i] === key[i]) {\n            score++;\n        }\n    }\n    return score;\n}\n\nfunction calculateMeanItemDifficulty(studentData, key, include) {\n    let totalMatches = 0;\n    let totalItems = 0;\n    studentData.forEach(line => {\n        for (let i = 0; i < key.length; i++) {\n            if (include[i].toLowerCase() === 'y') {\n                totalItems++;\n                if (line[i] === key[i]) {\n                    totalMatches++;\n                }\n            }\n        }\n    });\n    return totalMatches / totalItems;\n}\n\nfunction calculateMeanDiscriminationIndex(studentData, key, include) {\n    // Placeholder function, replace with actual calculation\n    return 0.5;\n}\n\nfunction calculateMeanPointBiserial(studentData, key, include) {\n    // Placeholder function, replace with actual calculation\n    return 0.3;\n}\n\nfunction calculateMeanAdjPointBiserial(studentData, key, include) {\n    // Placeholder function, replace with actual calculation\n    return 0.4;\n}\n\nmodule.exports = {\n    processData,\n    validateInputs,\n    calculateSkewness,\n    calculateKurtosis,\n    calculateTotalPossibleScore,\n    getScores,\n    calculateScore,\n    calculateMeanItemDifficulty,\n    calculateMeanDiscriminationIndex,\n    calculateMeanPointBiserial,\n    calculateMeanAdjPointBiserial\n};\n\n//# sourceURL=webpack:///./src/js/controller/dataProcessors.js?");

/***/ }),

/***/ "./src/js/controller/results/quickTestItem.js":
/*!****************************************************!*\
  !*** ./src/js/controller/results/quickTestItem.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { \n    calculateMeanDiscriminationIndex,\n    calculateMeanItemDifficulty,\n    calculateMeanPointBiserial,\n    calculateMeanAdjPointBiserial\n } = __webpack_require__(/*! ../dataProcessors */ \"./src/js/controller/dataProcessors.js\");\n\nfunction calculateQuickTestItemResults(studentData, key, include) {\n    const numItemsExcluded = include.split('').filter(char => char.toLowerCase() === 'n').length;\n    const numItemsAnalyzed = include.split('').filter(char => char.toLowerCase() === 'y').length;\n    const meanItemDifficulty = calculateMeanItemDifficulty(studentData, key, include);\n    const meanDiscriminationIndex = calculateMeanDiscriminationIndex(studentData, key, include);\n    const meanPointBiserial = calculateMeanPointBiserial(studentData, key, include);\n    const meanAdjPointBiserial = calculateMeanAdjPointBiserial(studentData, key, include);\n\n    return {\n        numItemsExcluded,\n        numItemsAnalyzed,\n        meanItemDifficulty,\n        meanDiscriminationIndex,\n        meanPointBiserial,\n        meanAdjPointBiserial\n    };\n}\n\nmodule.exports = {\n    calculateQuickTestItemResults\n}\n\n//# sourceURL=webpack:///./src/js/controller/results/quickTestItem.js?");

/***/ }),

/***/ "./src/js/view/eventListeners.js":
/*!***************************************!*\
  !*** ./src/js/view/eventListeners.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initializeEventListeners: () => (/* binding */ initializeEventListeners)\n/* harmony export */ });\n/* harmony import */ var _manual_data_getData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./manual_data/getData.js */ \"./src/js/view/manual_data/getData.js\");\n/* harmony import */ var _file_data_getData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./file_data/getData.js */ \"./src/js/view/file_data/getData.js\");\n\n\n\nfunction initializeEventListeners() {\n    const loadDataButton = document.getElementById('loadDataButton');\n    const editDataButton = document.getElementById('editDataButton');\n    const loadDataContainer = document.getElementById('loadDataContainer');\n    const editDataContainer = document.getElementById('editDataContainer');\n    const resultsContainer = document.getElementById('resultsContainer');\n    const mainMenu = document.querySelector('.main-menu');\n    const backButton1 = document.getElementById('backButton1');\n    const backButton2 = document.getElementById('backButton2');\n    const backButton3 = document.getElementById('backButton3');\n    const processManualDataButton = document.getElementById('processManualDataButton');\n\n    if (editDataButton) {\n        editDataButton.addEventListener('click', () => {\n            mainMenu.classList.add('hidden');\n            editDataContainer.classList.remove('hidden');\n            editDataContainer.classList.add('fade-in');\n        });\n    }\n\n    if (backButton1) {\n        backButton1.addEventListener('click', () => {\n            loadDataContainer.classList.add('hidden');\n            mainMenu.classList.remove('hidden');\n        });\n    }\n\n    if (backButton2) {\n        backButton2.addEventListener('click', () => {\n            editDataContainer.classList.add('hidden');\n            mainMenu.classList.remove('hidden');\n        });\n    }\n\n    if (backButton3) {\n        backButton3.addEventListener('click', () => {\n            resultsContainer.classList.add('hidden');\n            mainMenu.classList.remove('hidden');\n        });\n    }\n\n    if (processManualDataButton) {\n        processManualDataButton.addEventListener('click', (event) => {\n            event.preventDefault(); // Prevent page reload\n            const manualData = document.getElementById('manualDataInput').value;\n            (0,_manual_data_getData_js__WEBPACK_IMPORTED_MODULE_0__.getDataFromManualInput)(manualData);\n        });\n    }\n\n    if (loadDataButton) {\n        loadDataButton.addEventListener('click', () => {\n            const fileInput = document.createElement('input');\n            fileInput.type = 'file';\n            fileInput.accept = '.dat';\n            fileInput.onchange = () => (0,_file_data_getData_js__WEBPACK_IMPORTED_MODULE_1__.handleFileSelect)(fileInput);\n            fileInput.click();\n        });\n    }\n}\n\n//# sourceURL=webpack:///./src/js/view/eventListeners.js?");

/***/ }),

/***/ "./src/js/view/file_data/getData.js":
/*!******************************************!*\
  !*** ./src/js/view/file_data/getData.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getDataFromFile: () => (/* binding */ getDataFromFile),\n/* harmony export */   handleFileSelect: () => (/* binding */ handleFileSelect)\n/* harmony export */ });\n/* harmony import */ var _controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../controller/dataProcessors.js */ \"./src/js/controller/dataProcessors.js\");\n/* harmony import */ var _controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controller_results_quickTestItem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../controller/results/quickTestItem.js */ \"./src/js/controller/results/quickTestItem.js\");\n/* harmony import */ var _controller_results_quickTestItem_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_controller_results_quickTestItem_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _results_results_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../results/results.js */ \"./src/js/view/results/results.js\");\n\n\n\n\n\nfunction handleFileSelect(fileInput) {\n    const file = fileInput.files[0];\n\n    if (file) {\n        const reader = new FileReader();\n        reader.onload = function(e) {\n            const contents = e.target.result;\n            getDataFromFile(contents);\n        };\n        reader.readAsText(file);\n    } else {\n        alert('No file selected');\n    }\n}\n\nfunction getDataFromFile(data) {\n    const lines = data.split('\\n');\n    const dataObject = {};\n    let dataIndex = -1;\n\n    lines.forEach((line, index) => {\n        const [key, value] = line.split(':');\n        if (key.trim() === 'data') {\n            dataIndex = index + 1;\n        } else if (key && value !== undefined) {\n            dataObject[key.trim()] = value.trim();\n        }\n    });\n\n    const title = dataObject.title;\n    const comments = dataObject.comments;\n    const numberOfStudents = parseInt(dataObject.nstudents);\n    const numberOfItems = parseInt(dataObject.nitems);\n    const offset = parseInt(dataObject.noffset);\n    const key = dataObject.key;\n    const options = dataObject.options;\n    const include = dataObject.include;\n\n    const studentData = lines.slice(dataIndex, dataIndex + numberOfStudents);\n    if (studentData.length !== numberOfStudents || studentData.some(line => line.length !== numberOfItems)) {\n        alert('Data format error: number of students or items does not match the specified values.');\n        return;\n    }\n\n    if ((0,_controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0__.validateInputs)(key, options, include, numberOfItems)) {\n        const { totalPossibleScore, scores, result } = (0,_controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0__.processData)(numberOfStudents, offset, key, include, studentData);\n        const quickTestItemResults = (0,_controller_results_quickTestItem_js__WEBPACK_IMPORTED_MODULE_1__.calculateQuickTestItemResults)(studentData, key, include);\n        (0,_results_results_js__WEBPACK_IMPORTED_MODULE_2__.showResults)(title, comments, result, totalPossibleScore, quickTestItemResults);\n    }\n}\n\n\n\n//# sourceURL=webpack:///./src/js/view/file_data/getData.js?");

/***/ }),

/***/ "./src/js/view/manual_data/counters.js":
/*!*********************************************!*\
  !*** ./src/js/view/manual_data/counters.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   initializeEventListeners: () => (/* binding */ initializeEventListeners),\n/* harmony export */   updateCounter: () => (/* binding */ updateCounter)\n/* harmony export */ });\nfunction initializeEventListeners() {\n    const keyInput = document.getElementById('key');\n    if (keyInput) {\n        keyInput.addEventListener('input', () => updateCounter('key', 'charCounterKey'));\n    }\n\n    const optionsInput = document.getElementById('options');\n    if (optionsInput) {\n        optionsInput.addEventListener('input', () => updateCounter('options', 'charCounterOptions'));\n    }\n\n    const includeInput = document.getElementById('include');\n    if (includeInput) {\n        includeInput.addEventListener('input', () => updateCounter('include', 'charCounterInclude'));\n    }\n}\n\nfunction updateCounter(inputId, counterId) {\n    let input = document.getElementById(inputId);\n    let counter = document.getElementById(counterId);\n    counter.textContent = input.value.length;\n}\n\n\n\n//# sourceURL=webpack:///./src/js/view/manual_data/counters.js?");

/***/ }),

/***/ "./src/js/view/manual_data/getData.js":
/*!********************************************!*\
  !*** ./src/js/view/manual_data/getData.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getDataFromManualInput: () => (/* binding */ getDataFromManualInput)\n/* harmony export */ });\n/* harmony import */ var _controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../controller/dataProcessors.js */ \"./src/js/controller/dataProcessors.js\");\n/* harmony import */ var _controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _controller_results_quickTestItem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../controller/results/quickTestItem.js */ \"./src/js/controller/results/quickTestItem.js\");\n/* harmony import */ var _controller_results_quickTestItem_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_controller_results_quickTestItem_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _results_results_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../results/results.js */ \"./src/js/view/results/results.js\");\n\n\n\n\nfunction getDataFromManualInput(data) {\n    const title = document.getElementById('title').value;\n    const comments = document.getElementById('comments').value;\n    const numberOfStudents = parseInt(document.getElementById('students').value);\n    const numberOfItems = parseInt(document.getElementById('items').value);\n    const offset = parseInt(document.getElementById('offset').value);\n    const key = document.getElementById('key').value;\n    const options = document.getElementById('options').value;\n    const include = document.getElementById('include').value;\n    const studentData = document.getElementById('manualDataInput').value.split('\\n').slice(0, numberOfStudents);\n\n    if ((0,_controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0__.validateInputs) (key, options, include, numberOfItems)){\n        const { totalPossibleScore, scores} = (0,_controller_dataProcessors_js__WEBPACK_IMPORTED_MODULE_0__.processData)(numberOfStudents, offset, key, include, studentData);\n        const quickTestItemResults = (0,_controller_results_quickTestItem_js__WEBPACK_IMPORTED_MODULE_1__.calculateQuickTestItemResults)(studentData, key, include);\n        (0,_results_results_js__WEBPACK_IMPORTED_MODULE_2__.showResults)(title, comments, result, totalPossibleScore, quickTestItemResults);\n    }\n}\n\n\n\n//# sourceURL=webpack:///./src/js/view/manual_data/getData.js?");

/***/ }),

/***/ "./src/js/view/results/results.js":
/*!****************************************!*\
  !*** ./src/js/view/results/results.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   formatQuickExamineeResults: () => (/* binding */ formatQuickExamineeResults),\n/* harmony export */   formatQuickTestItemResults: () => (/* binding */ formatQuickTestItemResults),\n/* harmony export */   formatResult: () => (/* binding */ formatResult),\n/* harmony export */   formatResultsOFile: () => (/* binding */ formatResultsOFile),\n/* harmony export */   initializeEventListeners: () => (/* binding */ initializeEventListeners),\n/* harmony export */   showResults: () => (/* binding */ showResults),\n/* harmony export */   showSlide: () => (/* binding */ showSlide)\n/* harmony export */ });\nfunction initializeEventListeners() {\n    const prevSlideButton = document.getElementById('prevSlide');\n    const nextSlideButton = document.getElementById('nextSlide');\n    let currentSlideIndex = 0;\n\n    if (prevSlideButton && nextSlideButton) {\n        prevSlideButton.addEventListener('click', () => {\n            showSlide(currentSlideIndex - 1);\n        });\n\n        nextSlideButton.addEventListener('click', () => {\n            showSlide(currentSlideIndex + 1);\n        });\n    }\n}\n\nfunction showSlide(index) {\n    const slides = document.querySelectorAll('.result-slide');\n    if (index >= 0 && index < slides.length) {\n        slides[currentSlideIndex].style.transform = `translateX(-${index * 100}%)`;\n        currentSlideIndex = index;\n    }\n}\n\nfunction showResults(title, comments, result, totalPossibleScore, quickTestItemResults) {\n    const resultsContainer = document.getElementById('resultsContainer');\n    resultsContainer.innerHTML = ''; // Clear previous contents\n\n    const resultElement = document.createElement('div');\n    resultElement.className = 'result-slide';\n    resultElement.innerText = formatResult(title, comments, result, totalPossibleScore, quickTestItemResults);\n    resultsContainer.appendChild(resultElement);\n\n    const downloadLink = document.createElement('a');\n    downloadLink.id = 'downloadLink';\n    downloadLink.className = 'btn btn-success btn-lg mt-3';\n    downloadLink.style.display = 'none';\n    downloadLink.innerText = 'Download Results';\n    resultsContainer.appendChild(downloadLink);\n\n    const blob = new Blob([formatResult(title, comments, result, totalPossibleScore, quickTestItemResults)], { type: 'text/plain' });\n    const url = URL.createObjectURL(blob);\n    downloadLink.href = url;\n    downloadLink.download = 'result.txt';\n    downloadLink.style.display = 'block';\n\n    // Show results container\n    document.getElementById('editDataContainer').classList.add('hidden');\n    document.querySelector('.main-menu').classList.add('hidden');\n    document.getElementById('resultsContainer').classList.remove('hidden');\n    document.getElementById('resultsContainer').classList.add('fade-in');\n}\n\nfunction formatResult(title, comments, result, totalPossibleScore, quickTestItemResults) {\n    // Implementation of result formatting\n    return `Title: ${title}\\nComments: ${comments}\\nResult: ${result}\\nTotal Possible Score: ${totalPossibleScore}\\nQuick Test Item Results: ${quickTestItemResults}`;\n}\n\nconst formatQuickExamineeResults = (title, comments, metrics, totalPossibleScore) => {\n    return `Title: ${title}\\nComments: ${comments}\\n` +\n           `Number of Examinees: ${metrics.numExaminees}\\n` +\n           `Total Possible Score: ${totalPossibleScore}\\n` +\n           `Minimum Score: ${metrics.minScore.toFixed(3)} = ${(metrics.minScore / totalPossibleScore * 100).toFixed(1)}%\\n` +\n           `Maximum Score: ${metrics.maxScore.toFixed(3)} = ${(metrics.maxScore / totalPossibleScore * 100).toFixed(1)}%\\n` +\n           `Median Score: ${metrics.median.toFixed(3)} = ${(metrics.median / totalPossibleScore * 100).toFixed(1)}%\\n` +\n           `Mean Score: ${metrics.mean.toFixed(3)} = ${(metrics.mean / totalPossibleScore * 100).toFixed(1)}%\\n` +\n           `Standard Deviation: ${metrics.stdDevPop.toFixed(3)}\\n` +\n           `Variance: ${metrics.varPop.toFixed(3)}\\n` +\n           `Skewness: ${metrics.skewness.toFixed(3)}\\n` +\n           `Kurtosis: ${metrics.kurtosis.toFixed(3)}\\n`;\n};\n\nconst formatQuickTestItemResults = (quickTestItemResults) => {\n    return `Number of Items Excluded: ${quickTestItemResults.numItemsExcluded}\\n` +\n           `Number of Items Analyzed: ${quickTestItemResults.numItemsAnalyzed}\\n` +\n           `Mean Item Difficulty: ${(quickTestItemResults.meanItemDifficulty * 100).toFixed(1)}%\\n` +\n           `Mean Discrimination Index: ${quickTestItemResults.meanDiscriminationIndex.toFixed(3)}\\n` +\n           `Mean Point Biserial: ${quickTestItemResults.meanPointBiserial.toFixed(3)}\\n` +\n           `Mean Adj. Point Biserial: ${quickTestItemResults.meanAdjPointBiserial.toFixed(3)}`;\n};\n\nconst formatResultsOFile = (title, comments, quickExamineeResultsStr, quickTestItemResultsStr) => {\n    return `${title}\\n${comments}\\n${quickExamineeResultsStr}\\n${quickTestItemResultsStr}`;\n};\n\n\n\n//# sourceURL=webpack:///./src/js/view/results/results.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/app.js");
/******/ 	
/******/ })()
;