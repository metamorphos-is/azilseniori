import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const archivePath = path.resolve(process.cwd(), process.argv[2] || "site.zip");
const domain = process.env.HOSTINGER_DOMAIN || "mediumorchid-kingfisher-188706.hostingersite.com";

if (!process.env.HOSTINGER_API_TOKEN) {
  console.error("HOSTINGER_API_TOKEN lipsește.");
  process.exit(1);
}

const transport = new StdioClientTransport({
  command: "npx",
  args: ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
  env: process.env,
});

const client = new Client({ name: "github-deploy", version: "1.0.0" }, { capabilities: {} });

try {
  await client.connect(transport);
  const result = await client.callTool({
    name: "hosting_deployStaticWebsite",
    arguments: { domain, archivePath, removeArchive: false },
  });
  console.log(JSON.stringify(result, null, 2));
  await client.callTool({
    name: "hosting_clearWebsiteCacheV1",
    arguments: { username: "u422988064", domain },
  });
} finally {
  await client.close();
}
