/** WS-3:8 — Frozen compatible architecture declarations. */
import { GoalWorkspaceCertification } from "./goalWorkspaceCertification.ts";
const names = Object.freeze(["Workspace Layer Architecture", "Canonical Namespace Rules",
  "Foundation Metadata", "Registry Metadata", "Model Metadata", "Validation Metadata",
  "Manifest Metadata", "Platform Metadata", "Certification Metadata"] as const);
export const GoalWorkspaceFreezeCompatibility = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:8/Compatibility/${String(index + 1).padStart(2, "0")}`, name,
  description: `Confirms frozen compatibility with ${name}.`,
  source: GoalWorkspaceCertification, state: "Compatible", order: index + 1,
  metadataOnly: true, immutable: true,
})));

