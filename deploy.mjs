import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const archivePath = process.argv[2];

if (!archivePath) {
  console.error("Usage: node deploy.mjs <archive.zip>");
  process.exit(1);
}

const isWindows = process.platform === "win32";
const command = isWindows ? "cmd.exe" : "npx";
const args = isWindows
  ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
  : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"];

const transport = new StdioClientTransport({
  command,
  args,
  env: {
    ...process.env,
    PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}`,
  },
});

const client = new Client({ name: "azil-deploy", version: "1.0.0" }, { capabilities: {} });

try {
  await client.connect(transport);

  const websites = await client.callTool({
    name: "hosting_listWebsitesV1",
    arguments: { page: 1, per_page: 10 },
  });

  const text = websites.content?.find((c) => c.type === "text")?.text || "";
  const data = JSON.parse(text);
  const list = data?.data || data?.websites || [];

  if (!list.length) {
    throw new Error("Nu am găsit niciun website în contul Hostinger.");
  }

  const site = list.find((w) => w.is_enabled !== false) || list[0];
  const domain = site.domain;
  const absArchive = path.resolve(__dirname, archivePath);

  console.log(`Deploy pe domeniul: ${domain}`);
  console.log(`Arhivă: ${absArchive}`);

  const result = await client.callTool({
    name: "hosting_deployStaticWebsite",
    arguments: {
      domain,
      archivePath: absArchive,
      removeArchive: true,
    },
  });

  console.log(JSON.stringify(result, null, 2));
} finally {
  await client.close();
}
