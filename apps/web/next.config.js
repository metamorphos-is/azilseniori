/** @type {import('next').NextConfig} */
const path = require("path");

const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@azilseniori/database"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  ...(isStaticExport ? { output: "export", images: { unoptimized: true } } : {}),
};

module.exports = nextConfig;
