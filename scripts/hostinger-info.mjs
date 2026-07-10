import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const USERNAME = "u422988064";
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";

const isWindows = process.platform === "win32";
const transport = new StdioClientTransport({
  command: isWindows ? "cmd.exe" : "npx",
  args: isWindows
    ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
    : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
  env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}` },
});

const client = new Client({ name: "hostinger-info", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);

const websites = await client.callTool({
  name: "hosting_listWebsitesV1",
  arguments: { username: USERNAME, page: 1, per_page: 20 },
});
console.log("Websites:", JSON.stringify(websites, null, 2));

const builds = await client.callTool({
  name: "hosting_listNodeJSBuildsV1",
  arguments: { username: USERNAME, domain: DOMAIN, page: 1, per_page: 5 },
});
console.log("Node builds:", JSON.stringify(builds, null, 2));

const dbs = await client.callTool({
  name: "hosting_listAccountDatabasesV1",
  arguments: { username: USERNAME, domain: DOMAIN, page: 1, per_page: 20 },
});
console.log("Databases:", JSON.stringify(dbs, null, 2));

await client.close();
