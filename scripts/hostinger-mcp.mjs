import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

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

const client = new Client({ name: "hostinger-script", version: "1.0.0" }, { capabilities: {} });

const tool = process.argv[2];
const argsJson = process.argv[3] || "{}";

if (!tool) {
  console.error("Usage: node scripts/hostinger-mcp.mjs <toolName> [jsonArgs]");
  process.exit(1);
}

try {
  await client.connect(transport);
  const result = await client.callTool({
    name: tool,
    arguments: JSON.parse(argsJson),
  });
  console.log(JSON.stringify(result, null, 2));
} finally {
  await client.close();
}
