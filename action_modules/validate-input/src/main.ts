import * as core from '@actions/core'

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

async function run(): Promise<void> {
  try {
    validateInput();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

function validateInput(): void {
  // Capture runtype and perform other validations based on this
const runtypeInput = core.getInput(INPUT_RUNTYPE);

if (runtypeInput.toLowerCase() === RUNTYPE_SIMPLE) {
    core.debug('COMMAND = scanner:run');
    core.exportVariable(ENV_COMMAND, 'scanner:run');
    validateSimpleRun();
} else if (runtypeInput.toLowerCase() === RUNTYPE_DFA) {
    core.debug('COMMAND = scanner:run:dfa');
    core.exportVariable(ENV_COMMAND, 'scanner:run:dfa');
    validateDfaRun();
} else if (runtypeInput.toLowerCase() === RUNTYPE_ALL) {
    throw new Error('Running both simple and dfa runs is not supported yet');
}

const resultascommentsInput = core.getBooleanInput(INPUT_RESULTASCOMMENT);
if (resultascommentsInput) {
  throw new Error('resultascomments is not supported yet');
}
}

function validateSimpleRun(): void {
  const engineInput = core.getInput(INPUT_ENGINE);

  core.debug(`ENGINE = ${engineInput}`);
  if (!engineInput) {
      // We don't need --engine if there's no non-default engine requested.
      core.exportVariable(ENV_ENGINE, '');
  } else {
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

run()
