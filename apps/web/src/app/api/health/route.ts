import { NextResponse } from "next/server";
import { prisma } from "@azilseniori/database";

export async function GET() {
  let database: "connected" | "disconnected" = "disconnected";

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch {
    database = "disconnected";
  }

  return NextResponse.json({
    status: "ok",
    service: "azilseniori-web",
    database,
    timestamp: new Date().toISOString(),
  });
}
