import type { NextConfig } from "next";
import { execFileSync } from "node:child_process";
const config: NextConfig = {
  output: "export",
  generateBuildId: async () =>
    execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
};
export default config;
