import io = require('@actions/io');
import fs = require('fs');
import os = require('os');
import path = require('path');

const toolDir = path.join(__dirname, 'runner', 'tools');
const tempDir = path.join(__dirname, 'runner', 'temp');

process.env['RUNNER_TOOL_CACHE'] = toolDir;
process.env['RUNNER_TEMP'] = tempDir;
import * as installer from '../src/installer';

describe('installer tests', () => {
  beforeAll(async () => {
    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
  }, 100000);

  afterAll(async () => {
    try {
      await io.rmRF(toolDir);
      await io.rmRF(tempDir);
    } catch {
      console.log('Failed to remove test directories');
    }
  }, 100000);

  it('Acquires version of kubectl if no matching version is installed', async () => {
    await installer.getKubectl('v1.14.0');
    const kubectlDir = path.join(toolDir, 'kubectl', '1.14.0', os.arch());

    expect(fs.existsSync(`${kubectlDir}.complete`)).toBe(true);
    expect(fs.existsSync(path.join(kubectlDir, 'kubectl'))).toBe(true);
  }, 100000);

  it('Throws if no location contains correct kubectl version', async () => {
    let thrown = false;
    try {
      await installer.getKubectl('1000.0');
    } catch {
      thrown = true;
    }
    expect(thrown).toBe(true);
  });

  it('Uses version of kubectl installed in cache', async () => {
    const kubectlDir: string = path.join(toolDir, 'kubectl', '250.0.0', os.arch());
    await io.mkdirP(kubectlDir);
    fs.writeFileSync(`${kubectlDir}.complete`, 'dummy content');
    // This will throw if it doesn't find it in the cache (because no such version exists)
    await installer.getKubectl('250.0');
    return;
  });

  it('Doesnt use version of kubectl that was only partially installed in cache', async () => {
    const kubectlDir: string = path.join(toolDir, 'kubectl', '0.0.1', os.arch());
    await io.mkdirP(kubectlDir);
    let thrown = false;
    try {
      // This will throw if it doesn't find it in the cache (because no such version exists)
      await installer.getKubectl('v0.0.1');
    } catch {
      thrown = true;
    }
    expect(thrown).toBe(true);
    return;
  });
});
