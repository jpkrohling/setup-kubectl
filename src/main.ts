import * as core from '@actions/core';
import * as installer from './installer';

async function run() {
  try {
    const version = core.getInput('kubectl-version');
    await installer.getKubectl(version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
