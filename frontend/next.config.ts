import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  decideRenderBuild,
  fetchFrontendCheck,
  readLocalTypecheckProof,
} from "./scripts/renderBuildGate.mjs";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

export default async function nexoraNextConfig(): Promise<NextConfig> {
  const decision = await renderBuildDecision();
  if (decision.action === "refuse") {
    throw new Error(decision.reason);
  }
  return {
  agentRules: false,
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  ...(process.env.NEXORA_NEXT_DIST_DIR
    ? { distDir: process.env.NEXORA_NEXT_DIST_DIR }
    : {}),
  turbopack: {
    root: frontendRoot,
  },
  typescript: {
    ignoreBuildErrors: decision.ignoreBuildErrors,
  },
  };
}

async function renderBuildDecision() {
  if (process.env.NEXORA_RENDER_BUILD !== "1") {
    return decideRenderBuild({ env: process.env });
  }
  const check = process.env.RENDER === "true"
    ? await fetchFrontendCheck(
      process.env.RENDER_GIT_COMMIT?.trim() || "",
      fetch,
      process.env.GITHUB_TOKEN,
    )
    : null;
  return decideRenderBuild({
    env: process.env,
    check,
    localProof: readLocalTypecheckProof(process.env),
  });
}
