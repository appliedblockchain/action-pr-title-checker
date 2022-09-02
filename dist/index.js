require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 684:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 733:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 116:
/***/ ((module) => {

module.exports = eval("require")("@octokit/action");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__nccwpck_require__.r(__webpack_exports__);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(684);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(733);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nccwpck_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);


const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const issue_number = _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.issue.number;
const configPath = process.env.INPUT_CONFIGURATION_PATH;
const passOnOctokitError = process.env.INPUT_PASS_ON_OCTOKIT_ERROR === "true";
const { Octokit } = __nccwpck_require__(116);

let octokit;

// most @actions toolkit packages have async methods
async function run() {
  try {
    const title = _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.payload.pull_request.title;
    const labels = _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.payload.pull_request.labels;
    const header = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput("header", { required: false }) || "";
    const message = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput("message", { required: false });
    let config;
    try {
      config = await getJSON(configPath);
    } catch (e) {
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(`Couldn't retrieve the config file specified - ${e}`);
      return;
    }
    let { CHECKS, LABEL, MESSAGES } = JSON.parse(config);
    LABEL.name = LABEL.name || "title needs formatting";
    LABEL.color = LABEL.color || "eee";
    CHECKS.ignoreLabels = CHECKS.ignoreLabels || [];
    MESSAGES = MESSAGES || {};
    MESSAGES.success = MESSAGES.success || "All OK";
    MESSAGES.failure = MESSAGES.failure || "Failing CI test";
    MESSAGES.notice = MESSAGES.notice || "";

    for (let i = 0; i < labels.length; i++) {
      for (let j = 0; j < CHECKS.ignoreLabels.length; j++) {
        if (labels[i].name == CHECKS.ignoreLabels[j]) {
          _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Ignoring Title Check for label - ${labels[i].name}`);
          removeLabel(labels, LABEL.name);
          return;
        }
      }
    }

    try {
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Creating label (${LABEL.name})...`);
      let createResponse = await octokit.issues.createLabel({
        owner,
        repo,
        name: LABEL.name,
        color: LABEL.color,
      });
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Created label (${LABEL.name}) - ${createResponse.status}`);
    } catch (error) {
      // Might not always be due to label's existence
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Label (${LABEL.name}) already created.`);
    }
    if (CHECKS.prefixes && CHECKS.prefixes.length) {
      for (let i = 0; i < CHECKS.prefixes.length; i++) {
        if (title.startsWith(CHECKS.prefixes[i])) {
          removeLabel(labels, LABEL.name);
          _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(MESSAGES.success);
          return;
        }
      }
    }

    if (CHECKS.regexp) {
      let re = new RegExp(CHECKS.regexp, CHECKS.regexpFlags || "");
      if (re.test(title)) {
        removeLabel(labels, LABEL.name);
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(MESSAGES.success);
        return;
      }
    }

    if(message.trim()){
      await createComment(octokit, repo, issue_number, message, header);
    }

    await titleCheckFailed(CHECKS, LABEL, MESSAGES);
  } catch (error) {
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(error);
  }
}

async function titleCheckFailed(CHECKS, LABEL, MESSAGES) {
  try {
    if (MESSAGES.notice.length) {
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.notice(MESSAGES.notice);
    }

    await addLabel(LABEL.name);

    if (CHECKS.alwaysPassCI) {
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(MESSAGES.failure);
    } else {
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(MESSAGES.failure);
    }
  } catch (error) {
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(error);
    if (CHECKS.alwaysPassCI) {
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Failed to add label (${LABEL.name}) to PR`);
    } else {
      _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(`Failed to add label (${LABEL.name}) to PR`);
    }
  }
}

async function addLabel(name) {
  _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Adding label (${name}) to PR...`);
  let addLabelResponse = await octokit.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: [name],
  });
  _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Added label (${name}) to PR - ${addLabelResponse.status}`);
}

async function removeLabel(labels, name) {
  try {
    if (
      !labels
        .map((label) => label.name.toLowerCase())
        .includes(name.toLowerCase())
    ) {
      return;
    }

    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info("No formatting necessary. Removing label...");
    let removeLabelResponse = await octokit.issues.removeLabel({
      owner,
      repo,
      issue_number,
      name: name,
    });
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Removed label - ${removeLabelResponse.status}`);
  } catch (error) {
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Failed to remove label (${name}) from PR: ${error}`);
  }
}

async function getJSON(repoPath) {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path: repoPath,
    ref: _actions_github__WEBPACK_IMPORTED_MODULE_1__.context.sha,
  });

  return Buffer.from(response.data.content, response.data.encoding).toString();
}

async function handleOctokitError(e) {
  _actions_core__WEBPACK_IMPORTED_MODULE_0__.info(`Octokit Error - ${e}`);
  if (passOnOctokitError) {
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.info("Passing CI regardless");
  } else {
    _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed("Failing CI test");
  }
}

async function createComment(octokit, repo, issue_number, body, header) {
  await octokit.issues.createComment({
    ...repo,
    issue_number,
    body: `${body}\n${headerComment(header)}`
  });
}


try {
  octokit = new Octokit();
} catch (e) {
  handleOctokitError(e);
}

if (octokit) {
  run();
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map