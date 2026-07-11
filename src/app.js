require("./config/env");

const express = require("express");
const cors = require("cors");
const path = require("path");
const careHomes = require("./services/careHomes.service");
const { prisma } = require("./config/prisma");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.locals.fmtPrice = (from, to) => {
  if (!from && !to) return "La cerere";
  if (from && to) return `${from.toLocaleString("ro-RO")} – ${to.toLocaleString("ro-RO")} RON/lună`;
  return `${(from || to).toLocaleString("ro-RO")} RON/lună`;
};

app.locals.fmt = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("ro-RO");
};

function asyncRoute(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

function flash(req) {
  return { ok: req.query.ok || "", error: req.query.error || "" };
}

function back(res, url, message, type = "ok") {
  const sep = url.includes("?") ? "&" : "?";
  res.redirect(`${url}${sep}${type}=${encodeURIComponent(message)}`);
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "azilseniori", time: new Date().toISOString() });
});

app.get("/api/health", asyncRoute(async (req, res) => {
  let database = "disconnected";
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "connected";
  } catch {
    database = "disconnected";
  }
  res.json({
    status: "ok",
    service: "azilseniori",
    database,
    timestamp: new Date().toISOString(),
  });
}));

app.get("/diagnostics", asyncRoute(async (req, res) => {
  const stats = await careHomes.getStats();
  res.json({
    ok: true,
    app: "azilseniori",
    node: process.version,
    env: process.env.NODE_ENV || "development",
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    stats,
    time: new Date().toISOString(),
  });
}));

app.get("/", asyncRoute(async (req, res) => {
  const [stats, featured] = await Promise.all([
    careHomes.getStats(),
    careHomes.listCareHomes({}),
  ]);
  res.render("home", {
    title: "Acasă",
    stats,
    featured: featured.slice(0, 3),
    flash: flash(req),
  });
}));

app.get("/caut", asyncRoute(async (req, res) => {
  const results = await careHomes.listCareHomes(req.query);
  res.render("search", {
    title: "Caut un cămin",
    results,
    counties: careHomes.COUNTIES,
    query: req.query,
    flash: flash(req),
  });
}));

app.get("/camin/:slug", asyncRoute(async (req, res) => {
  const home = await careHomes.getCareHomeBySlug(req.params.slug);
  if (!home) return res.status(404).render("error", { title: "Negăsit", message: "Căminul nu a fost găsit." });
  res.render("care-home", { title: home.name, home, flash: flash(req) });
}));

app.post("/camin/:slug/contact", asyncRoute(async (req, res) => {
  const home = await careHomes.getCareHomeBySlug(req.params.slug);
  if (!home) return res.status(404).send("Cămin negăsit.");

  await careHomes.createLead({
    type: "family_inquiry",
    name: req.body.name,
    email: req.body.email || null,
    phone: req.body.phone || null,
    message: req.body.message || null,
    careHomeId: home.id?.startsWith("demo") ? null : home.id,
    metadata: { careHomeSlug: home.slug },
  });

  back(res, `/camin/${home.slug}`, "Solicitarea ta a fost trimisă. Te contactăm în curând.");
}));

app.get("/pentru-camine", (req, res) => {
  res.render("for-homes", { title: "Pentru cămine", flash: flash(req) });
});

app.get("/inscrie-camin", (req, res) => {
  res.render("register-home", {
    title: "Înscrie un cămin",
    counties: careHomes.COUNTIES,
    flash: flash(req),
  });
});

app.post("/inscrie-camin", asyncRoute(async (req, res) => {
  if (!req.body.name || !req.body.city || !req.body.county) {
    return back(res, "/inscrie-camin", "Completează numele, orașul și județul.", "error");
  }

  if (!process.env.DATABASE_URL) {
    return back(res, "/inscrie-camin", "Înscrierea demo a fost înregistrată (fără DB).", "ok");
  }

  await careHomes.createCareHomeRegistration(req.body);
  back(res, "/inscrie-camin", "Cererea de înscriere a fost trimisă. Echipa noastră o va verifica în 24–48h.");
}));

app.get("/autentificare", (req, res) => {
  res.render("login", { title: "Autentificare", flash: flash(req) });
});

app.post("/autentificare", (req, res) => {
  back(res, "/autentificare", "Autentificarea completă vine în Faza 2 (OAuth + SMS OTP).", "error");
});

app.get("/panou", asyncRoute(async (req, res) => {
  const stats = await careHomes.getStats();
  let inquiries = [];
  try {
    inquiries = await prisma.leadInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { careHome: { select: { name: true } } },
    });
  } catch {
    inquiries = [];
  }
  res.render("dashboard", { title: "Panou", stats, inquiries, flash: flash(req) });
}));

app.use((req, res) => {
  res.status(404).render("error", { title: "404", message: "Pagina nu a fost găsită." });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).render("error", {
    title: "Eroare",
    message: err.message || "A apărut o eroare neașteptată.",
  });
});

module.exports = app;
