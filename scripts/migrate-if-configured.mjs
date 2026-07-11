import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[azilseniori] DATABASE_URL not set — skipping Prisma migrations");
  process.exit(0);
}

console.log("[azilseniori] Running Prisma migrations...");
execSync("npm run migrate:deploy -w @azilseniori/database", {
  stdio: "inherit",
  env: process.env,
});
