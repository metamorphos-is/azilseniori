import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const USERNAME = "u422988064";
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";

function getToken() {
  const credPath = path.join(
    process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
    "hostinger-mcp",
    "credentials.json",
  );
  const creds = JSON.parse(fs.readFileSync(credPath, "utf8"));
  return creds.access_token;
}

function createArchive() {
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const zipName = `azilseniori_${stamp}.zip`;
  const zipPath = path.join(ROOT, zipName);
  const excludes = ["node_modules", ".next", "dist", "out", "build", ".git", "coverage", ".turbo", "*.zip"];
  execSync(["tar", "-acf", zipPath, ...excludes.flatMap((d) => ["--exclude", d]), "-C", ROOT, "."].join(" "), {
    stdio: "inherit",
  });
  return zipPath;
}

async function uploadArchive(archivePath) {
  const isWindows = process.platform === "win32";
  const transport = new StdioClientTransport({
    command: isWindows ? "cmd.exe" : "npx",
    args: isWindows
      ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
      : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
    env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}` },
  });

  const client = new Client({ name: "upload", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
  const result = await client.callTool({
    name: "hosting_deployJsApplication",
    arguments: { domain: DOMAIN, archivePath, removeArchive: false },
  });
  await client.close();
  return { archivePath, result };
}

async function triggerBuild(archiveBasename) {
  const token = getToken();
  const url = `https://developers.hostinger.com/api/hosting/v1/accounts/${USERNAME}/websites/${DOMAIN}/nodejs/builds`;

  const buildData = {
    node_version: 20,
    package_manager: "npm",
    root_directory: ".",
    build_script: "build",
    output_directory: "apps/web/.next",
    source_type: "archive",
    source_options: { archive_path: archiveBasename },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "azilseniori-deploy/1.0",
    },
    body: JSON.stringify(buildData),
  });

  const body = await response.text();
  console.log(`Build trigger status: ${response.status}`);
  console.log(body);

  if (!response.ok) throw new Error(`Build trigger failed: ${response.status} ${body}`);
  return JSON.parse(body);
}

const archivePath = createArchive();
console.log(`Created ${archivePath}`);

const { result: uploadResult } = await uploadArchive(archivePath);
console.log("Upload result:", JSON.stringify(uploadResult, null, 2));

const archiveBasename = path.basename(archivePath);
const build = await triggerBuild(archiveBasename);
console.log("Build started:", JSON.stringify(build, null, 2));

if (fs.existsSync(archivePath)) fs.unlinkSync(archivePath);
