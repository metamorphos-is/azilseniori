const { execSync } = require("child_process");
const path = require("path");

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL not set — skipping migrations.");
    return;
  }

  console.log("Running Prisma migrations...");
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    cwd: path.join(__dirname, "../.."),
    env: process.env,
  });
}

async function runSeed() {
  if (!process.env.DATABASE_URL) return;

  try {
    const count = await require("./prisma").prisma.careHome.count();
    if (count === 0) {
      console.log("Seeding database...");
      execSync("npx prisma db seed", {
        stdio: "inherit",
        cwd: path.join(__dirname, "../.."),
        env: process.env,
      });
    }
  } catch (error) {
    console.warn("Seed skipped:", error.message);
  }
}

module.exports = { runMigrations, runSeed };
