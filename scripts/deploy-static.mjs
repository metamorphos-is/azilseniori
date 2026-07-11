import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";

const isWindows = process.platform === "win32";

function createStaticZip() {
  console.log("Building static export...");
  const apiDir = path.join(ROOT, "apps", "web", "src", "app", "api");
  const apiBackup = path.join(ROOT, "apps", "web", "src", "app", "_api_backup");
  let movedApi = false;

  if (fs.existsSync(apiDir)) {
    fs.renameSync(apiDir, apiBackup);
    movedApi = true;
  }

  try {
    execSync("npm run build:static -w @azilseniori/web", {
      stdio: "inherit",
      cwd: ROOT,
      env: { ...process.env, STATIC_EXPORT: "1" },
    });
  } finally {
    if (movedApi && fs.existsSync(apiBackup)) {
      fs.renameSync(apiBackup, apiDir);
    }
  }

  const outDir = path.join(ROOT, "apps", "web", "out");
  if (!fs.existsSync(outDir)) throw new Error("Static export folder not found: apps/web/out");

  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const zipPath = path.join(ROOT, `static_${stamp}.zip`);
  execSync(`tar -acf "${zipPath}" -C "${outDir}" .`, { stdio: "inherit" });
  return zipPath;
}

const zipPath = createStaticZip();
console.log(`Deploying ${zipPath}...`);

const transport = new StdioClientTransport({
  command: isWindows ? "cmd.exe" : "npx",
  args: isWindows
    ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
    : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
  env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}` },
});

const client = new Client({ name: "static-deploy", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);

const result = await client.callTool({
  name: "hosting_deployStaticWebsite",
  arguments: { domain: DOMAIN, archivePath: zipPath, removeArchive: true },
});

console.log(JSON.stringify(result, null, 2));
await client.close();
