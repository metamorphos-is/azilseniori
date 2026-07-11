import os from "node:os";
import path from "node:path";
import fs from "node:fs";

const USERNAME = "u422988064";
const DOMAIN = "mediumorchid-kingfisher-188706.hostingersite.com";
const API = "https://developers.hostinger.com/api/hosting/v1";

function getToken() {
  const credPath = path.join(
    process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"),
    "hostinger-mcp",
    "credentials.json",
  );
  return JSON.parse(fs.readFileSync(credPath, "utf8")).access_token;
}

const token = getToken();
const res = await fetch(`${API}/accounts/${USERNAME}/websites/${DOMAIN}/cache/clear`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${token}` },
});
console.log("Cache clear:", res.status, await res.text());
