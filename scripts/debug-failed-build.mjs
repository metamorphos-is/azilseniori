import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";
const FAILED_UUID = "019f4f59-c7bf-7053-ae14-4c00bd2fa150";

const isWindows = process.platform === "win32";
const transport = new StdioClientTransport({
  command: isWindows ? "cmd.exe" : "npx",
  args: isWindows
    ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
    : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
  env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}` },
});

const client = new Client({ name: "logs", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);

const logs = await client.callTool({
  name: "hosting_showJsDeploymentLogs",
  arguments: { domain: DOMAIN, buildUuid: FAILED_UUID },
});
console.log(logs.content?.[0]?.text);

await client.close();
