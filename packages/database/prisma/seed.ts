import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const careHomes = [
  {
    name: "Căminul Bătrânilor Speranța",
    slug: "speranta-bucuresti",
    city: "București",
    county: "București",
    description: "Centru modern cu îngrijire 24/7, grădină terapeutică și activități zilnice pentru seniori activi.",
    priceFrom: 2800,
    priceTo: 4200,
    services: ["Îngrijire medicală", "Fizioterapie", "Masă echilibrată", "Activități sociale"],
    rating: 4.8,
    reviewCount: 42,
    isVerified: true,
  },
  {
    name: "Residența Golden Years Cluj",
    slug: "golden-years-cluj",
    city: "Cluj-Napoca",
    county: "Cluj",
    description: "Atmosferă caldă, camere private, personal dedicat și program personalizat de recuperare.",
    priceFrom: 2500,
    priceTo: 3800,
    services: ["Îngrijire medicală", "Psihoterapie", "Transport", "Wi-Fi"],
    rating: 4.6,
    reviewCount: 31,
    isVerified: true,
  },
  {
    name: "Azilul Casa Verde Timișoara",
    slug: "casa-verde-timisoara",
    city: "Timișoara",
    county: "Timiș",
    description: "Spații luminoase, grădină interioară și echipă multidisciplinară pentru demență ușoară.",
    priceFrom: 2200,
    priceTo: 3500,
    services: ["Îngrijire medicală", "Masă echilibrată", "Activități sociale"],
    rating: 4.5,
    reviewCount: 18,
    isVerified: true,
  },
  {
    name: "Centrul Senior Plus Brașov",
    slug: "senior-plus-brasov",
    city: "Brașov",
    county: "Brașov",
    description: "Locație liniștită la poalele Tâmpei, cu terapie ocupațională și monitorizare medicală.",
    priceFrom: 2100,
    priceTo: 3200,
    services: ["Fizioterapie", "Masă echilibrată", "Transport"],
    rating: 4.4,
    reviewCount: 24,
    isVerified: false,
  },
  {
    name: "Căminul Florilor Iași",
    slug: "florilor-iasi",
    city: "Iași",
    county: "Iași",
    description: "Comunitate prietenoasă, mese adaptate dietei și salon de lectură pentru rezidenți.",
    priceFrom: 1900,
    priceTo: 2900,
    services: ["Îngrijire medicală", "Activități sociale", "Wi-Fi"],
    rating: 4.3,
    reviewCount: 15,
    isVerified: true,
  },
  {
    name: "Residența Marea Neagră Constanța",
    slug: "marea-neagra-constanta",
    city: "Constanța",
    county: "Constanța",
    description: "Vedere spre mare, plimbări ghidate și program de wellness pentru seniori.",
    priceFrom: 2600,
    priceTo: 4000,
    services: ["Îngrijire medicală", "Fizioterapie", "Masă echilibrată", "Transport"],
    rating: 4.7,
    reviewCount: 27,
    isVerified: true,
  },
];

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

  for (const home of careHomes) {
    await prisma.careHome.upsert({
      where: { slug: home.slug },
      update: home,
      create: home,
    });
  }

  console.log(`Seed completed: ${careHomes.length} cămine demo.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
