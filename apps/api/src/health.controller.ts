import { Controller, Get } from "@nestjs/common";
import { prisma } from "@azilseniori/database";

@Controller("health")
export class HealthController {
  @Get()
  async getHealth() {
    let database: "connected" | "disconnected" = "disconnected";

    try {
      await prisma.$queryRaw`SELECT 1`;
      database = "connected";
    } catch {
      database = "disconnected";
    }

    return {
      status: "ok",
      service: "azilseniori-api",
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
