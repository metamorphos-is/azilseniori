#!/usr/bin/env node
/**
 * Hostinger Node.js entry point.
 * Starts the Next.js app from the monorepo root on the platform PORT.
 */
const { spawn } = require("node:child_process");
const path = require("node:path");

const port = process.env.PORT || "3000";
const nextBin = path.join(__dirname, "node_modules", ".bin", "next");
const webDir = path.join(__dirname, "apps", "web");

console.log(`[azilseniori] Starting Next.js on 0.0.0.0:${port}`);

const child = spawn(nextBin, ["start", webDir, "-H", "0.0.0.0", "-p", port], {
  stdio: "inherit",
  env: process.env,
  cwd: __dirname,
});

child.on("exit", (code) => process.exit(code ?? 1));
