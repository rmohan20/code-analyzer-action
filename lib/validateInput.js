"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/semi */
const core = __importStar(require("@actions/core"));
const INPUT_RUNTYPE = 'runtype';
const INPUT_ENGINE = 'engine';
const INPUT_PROJDIR = 'projectdir';
const INPUT_RESULTASCOMMENT = 'resultascomments';
const RUNTYPE_SIMPLE = 'simple';
const RUNTYPE_DFA = 'dfa';
const RUNTYPE_ALL = 'all';
const ENV_COMMAND = 'COMMAND';
const ENV_ENGINE = 'ENGINE';
const ENV_PROJDIR = 'PROJDIR';
function validateInput() {
    // Capture runtype and perform other validations based on this
    const runtypeInput = core.getInput(INPUT_RUNTYPE);
    if (runtypeInput.toLowerCase() === RUNTYPE_SIMPLE) {
        core.debug('COMMAND = scanner:run');
        core.exportVariable(ENV_COMMAND, 'scanner:run');
        validateSimpleRun();
    }
    else if (runtypeInput.toLowerCase() === RUNTYPE_DFA) {
        core.debug('COMMAND = scanner:run:dfa');
        core.exportVariable(ENV_COMMAND, 'scanner:run:dfa');
        validateDfaRun();
    }
    else if (runtypeInput.toLowerCase() === RUNTYPE_ALL) {
        core.setFailed('Running both simple and dfa runs is not supported yet');
    }
    const resultascommentsInput = core.getBooleanInput(INPUT_RESULTASCOMMENT);
    if (resultascommentsInput) {
        core.setFailed('resultascomments is not supported yet');
    }
}
function validateSimpleRun() {
    const engineInput = core.getInput(INPUT_ENGINE);
    core.debug(`ENGINE = ${engineInput}`);
    if (!engineInput) {
        // We don't need --engine if there's no non-default engine requested.
        core.exportVariable(ENV_ENGINE, '');
    }
    else {
        if (engineInput.indexOf('sfge') > -1) {
            core.debug('Found sfge as a requested engine.');
            addProjectDir();
        }
        // Add --engine param
        core.exportVariable(ENV_ENGINE, `--engine ${engineInput}`);
    }
}
function validateDfaRun() {
    // TODO: create input params and add thread count, thread timeout, jvmargs, limit
    // Add projectdir param
    addProjectDir();
}
function addProjectDir() {
    const projectdirInput = core.getInput(INPUT_PROJDIR);
    core.debug(`PROJECTDIR = ${projectdirInput}`);
    core.exportVariable(ENV_PROJDIR, `--projectdir ${projectdirInput}`);
}
validateInput();
