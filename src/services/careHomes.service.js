const { prisma } = require("../config/prisma");

const COUNTIES = [
  "București", "Cluj", "Timiș", "Brașov", "Iași", "Constanța", "Dolj", "Prahova", "Sibiu", "Argeș",
];

const DEMO_HOMES = [
  {
    id: "demo-1",
    name: "Căminul Bătrânilor Speranța",
    slug: "speranta-bucuresti",
    city: "București",
    county: "București",
    description: "Centru modern cu îngrijire 24/7 și activități zilnice.",
    priceFrom: 2800,
    priceTo: 4200,
    services: ["Îngrijire medicală", "Fizioterapie"],
    rating: 4.8,
    reviewCount: 42,
    isVerified: true,
    isPublished: true,
  },
];

async function listCareHomes(filters = {}) {
  const where = { isPublished: true };

  if (filters.county) where.county = filters.county;
  if (filters.city) where.city = { contains: filters.city };
  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q } },
      { city: { contains: filters.q } },
      { description: { contains: filters.q } },
    ];
  }
  if (filters.maxPrice) {
    where.priceFrom = { lte: Number(filters.maxPrice) };
  }

  try {
    return await prisma.careHome.findMany({
      where,
      orderBy: [{ isVerified: "desc" }, { rating: "desc" }],
      take: 50,
    });
  } catch {
    return DEMO_HOMES.filter((h) => {
      if (filters.county && h.county !== filters.county) return false;
      if (filters.q && !h.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
      return true;
    });
  }
}

async function getCareHomeBySlug(slug) {
  try {
    return await prisma.careHome.findUnique({ where: { slug } });
  } catch {
    return DEMO_HOMES.find((h) => h.slug === slug) || null;
  }
}

async function getStats() {
  try {
    const [homes, inquiries, verified] = await Promise.all([
      prisma.careHome.count({ where: { isPublished: true } }),
      prisma.leadInquiry.count(),
      prisma.careHome.count({ where: { isVerified: true, isPublished: true } }),
    ]);
    return { homes, inquiries, verified };
  } catch {
    return { homes: 6, inquiries: 0, verified: 5 };
  }
}

async function createLead(data) {
  return prisma.leadInquiry.create({ data });
}

async function createCareHomeRegistration(data) {
  const slug = data.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

  const home = await prisma.careHome.create({
    data: {
      name: data.name,
      slug: `${slug}-${Date.now().toString(36)}`,
      city: data.city,
      county: data.county,
      description: data.description || null,
      priceFrom: data.priceFrom ? Number(data.priceFrom) : null,
      priceTo: data.priceTo ? Number(data.priceTo) : null,
      services: data.services ? data.services.split(",").map((s) => s.trim()) : [],
      isVerified: false,
      isPublished: false,
    },
  });

  await prisma.leadInquiry.create({
    data: {
      type: "home_registration",
      name: data.contactName || data.name,
      email: data.email || null,
      phone: data.phone || null,
      message: data.description || null,
      careHomeId: home.id,
      metadata: { status: "pending_review" },
    },
  });

  return home;
}

module.exports = {
  COUNTIES,
  listCareHomes,
  getCareHomeBySlug,
  getStats,
  createLead,
  createCareHomeRegistration,
};
