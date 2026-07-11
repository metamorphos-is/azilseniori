import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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

const htaccess = process.argv[2] === "minimal"
  ? "DirectoryIndex index.html index.php\n"
  : `# DO NOT REMOVE — Hostinger Node.js Passenger config
PassengerAppRoot "/home/${USERNAME}/domains/${DOMAIN}/nodejs"
PassengerBaseURI "/"
PassengerNodejs "/opt/alt/alt-nodejs20/root/usr/bin/node"
PassengerAppType node
PassengerStartupFile server.js
`;

const body = Buffer.from(htaccess, "utf8");
const token = getToken();

const credRes = await fetch(`${API}/files/upload-urls`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ username: USERNAME, domain: DOMAIN }),
});
const creds = await credRes.json();
const { url: uploadUrl, auth_key: authToken, rest_auth_key: authRestToken } = creds;

const uploadTarget = `${uploadUrl.replace(/\/$/, "")}/public_html/.htaccess?override=true`;
const tusHeaders = {
  "X-Auth": authToken,
  "X-Auth-Rest": authRestToken,
  "upload-length": String(body.length),
  "upload-offset": "0",
};

const initRes = await fetch(uploadTarget, { method: "POST", headers: tusHeaders });
console.log("TUS init:", initRes.status);

const patchRes = await fetch(uploadTarget, {
  method: "PATCH",
  headers: {
    ...tusHeaders,
    "Content-Type": "application/offset+octet-stream",
  },
  body,
});
console.log("TUS upload:", patchRes.status);

const restartRes = await fetch(
  `${API}/accounts/${USERNAME}/websites/${DOMAIN}/nodejs/server/restart`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  },
);
console.log("Restart:", restartRes.status, await restartRes.text());
