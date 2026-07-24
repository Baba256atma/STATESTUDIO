/** WS-5:6 — Immutable compatibility declarations. */
import { ScenarioWorkspaceManifest } from "./scenarioWorkspaceManifest.ts";

const names = Object.freeze([
  "Workspace Layer Architecture",
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Canonical Namespace",
  "Public API Conventions",
  "TypeScript Strict Mode",
  "ESLint Compliance",
  "Freeze Architecture Requirements",
  "Public Index Requirements",
] as const);

export const ScenarioWorkspacePlatformCompatibility = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares compatibility with ${name}.`,
    source: ScenarioWorkspaceManifest,
    state: "Compatible",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
