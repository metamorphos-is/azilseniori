import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const USERNAME = "u422988064";
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";
const UUID = process.argv[2];

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
  arguments: { username: USERNAME, domain: DOMAIN, page: 1, per_page: 3 },
});
const buildsData = JSON.parse(builds.content?.[0]?.text || "{}");
const latest = buildsData.data?.[0];
console.log("Latest build:", latest?.uuid, latest?.state, latest?.options?.entry_file);

const uuid = UUID || latest?.uuid;
if (uuid) {
  const logs = await client.callTool({
    name: "hosting_getNodeJSBuildLogsV1",
    arguments: { username: USERNAME, domain: DOMAIN, uuid, from_line: 0 },
  });
  const logsData = JSON.parse(logs.content?.[0]?.text || "{}");
  const text = logsData.logs || "";
  console.log(text.slice(-2000));
}

await client.callTool({
  name: "hosting_restartNode.jsApplicationV1",
  arguments: { username: USERNAME, domain: DOMAIN },
});
console.log("Node.js server restart requested.");

await client.close();
