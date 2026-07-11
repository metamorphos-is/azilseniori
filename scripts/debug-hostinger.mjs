import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const USERNAME = "u422988064";
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";
const BUILD_UUID = "019f4f59-f98f-7329-87cb-1a686272dff0";

const isWindows = process.platform === "win32";
const transport = new StdioClientTransport({
  command: isWindows ? "cmd.exe" : "npx",
  args: isWindows
    ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
    : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
  env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}` },
});

const client = new Client({ name: "debug", version: "1.0.0" }, { capabilities: {} });
await client.connect(transport);

const logs = await client.callTool({
  name: "hosting_showJsDeploymentLogs",
  arguments: { domain: DOMAIN, buildUuid: BUILD_UUID },
});
console.log("Deployment logs:", logs.content?.[0]?.text);

const maintenance = await client.callTool({
  name: "hosting_showMaintenanceStatusV1",
  arguments: { username: USERNAME, domain: DOMAIN },
});
console.log("Maintenance:", maintenance.content?.[0]?.text);

await client.close();
