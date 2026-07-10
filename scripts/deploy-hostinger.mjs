import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";

const isWindows = process.platform === "win32";
const transport = new StdioClientTransport({
  command: isWindows ? "cmd.exe" : "npx",
  args: isWindows
    ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
    : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
  env: {
    ...process.env,
    PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}`,
  },
});

function createArchive() {
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  const zipName = `azilseniori_${stamp}.zip`;
  const zipPath = path.join(ROOT, zipName);

  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  const excludes = [
    "node_modules",
    ".next",
    "dist",
    "out",
    "build",
    ".git",
    "coverage",
    ".turbo",
  ];

  const tarExcludes = excludes.flatMap((dir) => ["--exclude", dir]);
  execSync(["tar", "-acf", zipPath, ...tarExcludes, "-C", ROOT, "."].join(" "), {
    stdio: "inherit",
  });

  const sizeMb = fs.statSync(zipPath).size / (1024 * 1024);
  console.log(`Archive: ${zipPath} (${sizeMb.toFixed(2)} MB)`);
  if (sizeMb > 50) {
    throw new Error("Archive exceeds Hostinger 50MB limit.");
  }
  return zipPath;
}

const client = new Client({ name: "hostinger-deploy", version: "1.0.0" }, { capabilities: {} });

try {
  const archivePath = createArchive();
  await client.connect(transport);

  console.log(`Deploying to ${DOMAIN}...`);
  const result = await client.callTool({
    name: "hosting_deployJsApplication",
    arguments: {
      domain: DOMAIN,
      archivePath,
      removeArchive: true,
    },
  });

  console.log(JSON.stringify(result, null, 2));
} finally {
  await client.close();
}
