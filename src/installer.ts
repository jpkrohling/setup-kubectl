// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as util from 'util';

const osPlat: string = os.platform();

export async function getKubectl(version: string) {
  // check cache
  let toolPath: string;
  toolPath = tc.find('kubectl', version);

  if (!toolPath) {
    // download, extract, cache
    toolPath = await acquireKubectl(version);
    core.debug('kubectl is cached under ' + toolPath);
  }

  core.addPath(toolPath);
}

async function acquireKubectl(version: string): Promise<string> {
  //
  // Download - a tool installer intimately knows how to get the tool (and construct urls)
  //
  let fileName: string = getFileName();
  let downloadUrl: string = getDownloadUrl(version, fileName);
  let downloadPath: string | null = null;
  try {
    downloadPath = await tc.downloadTool(downloadUrl);
  } catch (error) {
    core.debug(error);
    throw `Failed to download version ${version}: ${error}`;
  }

  return await tc.cacheFile(downloadPath, 'kubectl', 'kubectl', version);
}

function getFileName(): string {
  switch (osPlat) {
    case "darwin":
    case "linux":
      return "kubectl";
    case "win32":
      return "kubectl.exe";
    default:
      throw `Unknown platform: ${osPlat}`;
  }
}

function getDownloadUrl(version: string, filename: string): string {
  let arch: string = osPlat;

  if (arch === "win32") {
    arch = "windows";
  }

  return util.format('https://storage.googleapis.com/kubernetes-release/release/%s/bin/%s/amd64/%s', version, arch, filename);
}
