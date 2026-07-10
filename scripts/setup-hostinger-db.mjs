import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { randomBytes } from "node:crypto";

const isWindows = process.platform === "win32";
const transport = new StdioClientTransport({
  command: isWindows ? "cmd.exe" : "npx",
  args: isWindows
    ? ["/c", "npx", "--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"]
    : ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp", "--stdio"],
  env: { ...process.env, PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ""}` },
});

const USERNAME = "u422988064";
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";

const client = new Client({ name: "db-setup", version: "1.0.0" }, { capabilities: {} });

try {
  await client.connect(transport);

  const list = await client.callTool({
    name: "hosting_listAccountDatabasesV1",
    arguments: { username: USERNAME, domain: DOMAIN, page: 1, per_page: 20 },
  });
  console.log("Existing databases:", JSON.stringify(list, null, 2));

  const text = list.content?.find((c) => c.type === "text")?.text || "{}";
  const data = JSON.parse(text);
  const existing = data?.data || [];

  const targetName = "azilseniori";
  const found = existing.find((db) => db.name?.includes("azilseniori") || db.database?.includes("azilseniori"));

  if (found) {
    console.log("\nDatabase already exists:", JSON.stringify(found, null, 2));
    process.exit(0);
  }

  const password = randomBytes(16).toString("base64url");
  const create = await client.callTool({
    name: "hosting_createAccountDatabaseV1",
    arguments: {
      username: USERNAME,
      name: targetName,
      user: targetName,
      password,
      website_domain: DOMAIN,
    },
  });

  console.log("\nCreated database:", JSON.stringify(create, null, 2));
  console.log("\n--- SAVE THESE (add to Hostinger env vars, NOT in git) ---");
  console.log(`DATABASE_NAME=${targetName}`);
  console.log(`DATABASE_USER=${targetName}`);
  console.log(`DATABASE_PASSWORD=${password}`);
  console.log(`DATABASE_HOST=localhost`);
  console.log(`DATABASE_URL=mysql://${targetName}:${encodeURIComponent(password)}@localhost:3306/u422988064_${targetName}`);
} finally {
  await client.close();
}
