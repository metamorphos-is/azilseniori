import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { slug: "super_admin", name: "Super Admin", scope: "platform" },
    { slug: "administrator", name: "Administrator", scope: "platform" },
    { slug: "care_home_owner", name: "Owner cămin", scope: "care_home" },
    { slug: "family_user", name: "Utilizator familie", scope: "platform" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: { name: role.name, scope: role.scope },
      create: role,
    });
  }

  await prisma.siteSetting.upsert({
    where: { namespace_key: { namespace: "brand", key: "site_name" } },
    update: { value: "azilseniori.ro" },
    create: { namespace: "brand", key: "site_name", value: "azilseniori.ro" },
  });

  await prisma.siteSetting.upsert({
    where: { namespace_key: { namespace: "security", key: "phone_verification_required" } },
    update: { value: true },
    create: { namespace: "security", key: "phone_verification_required", value: true },
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
