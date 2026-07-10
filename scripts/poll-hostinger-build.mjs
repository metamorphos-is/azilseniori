import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const USERNAME = "u422988064";
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";
const UUID = process.argv[2] || "019f4dcb-3654-70f5-8f39-1edb7dc1a9a6";

const isWindows = process.platform === "win32";
const transport = new StdioClientTransport({
  command: isWindows ? "cmd.exe" : "npx",
  args: isWindows
    ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
    : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
  env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}` },
});

const client = new Client({ name: "poll", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);

const builds = await client.callTool({
  name: "hosting_listNodeJSBuildsV1",
  arguments: { username: USERNAME, domain: DOMAIN, page: 1, per_page: 5 },
});
console.log("Builds:", builds.content?.[0]?.text);

const logs = await client.callTool({
  name: "hosting_getNodeJSBuildLogsV1",
  arguments: { username: USERNAME, domain: DOMAIN, uuid: UUID, from_line: 0 },
});
console.log("Logs:", logs.content?.[0]?.text);

await client.close();
