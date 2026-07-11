require("./config/env");

const app = require("./app");
const { connectDB } = require("./config/prisma");
const { runMigrations, runSeed } = require("./config/bootstrap");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

async function start() {
  console.log("Starting azilseniori.ro...");
  console.log(`Node version: ${process.version}`);
  console.log(`DATABASE_URL present: ${process.env.DATABASE_URL ? "yes" : "no"}`);

  if (process.env.DATABASE_URL) {
    await runMigrations();
    await connectDB();
    await runSeed();
  } else {
    console.warn("Running without database — demo mode only.");
  }

  app.listen(PORT, HOST, () => {
    console.log(`azilseniori.ro running on http://${HOST}:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start azilseniori.ro:", error);
  process.exit(1);
});
