/** ASSISTANT-4:6 — Exactly 12 immutable Platform capabilities. */
import { AssistantExecutiveGuidanceManifest } from "./assistantExecutiveGuidanceManifest.ts";
import type { AssistantExecutiveGuidancePlatformDeclaration } from "./assistantExecutiveGuidancePlatform.types.ts";

const names = Object.freeze([
  "Foundation Composition",
  "Registry Composition",
  "Model Composition",
  "Validation Composition",
  "Manifest Publication",
  "Metadata Publication",
  "Consumer Integration",
  "Compatibility Declaration",
  "Platform Identity",
  "Executive Guidance Composition",
  "Readiness Publication",
  "Public Platform Exposure",
] as const);

export const AssistantExecutiveGuidancePlatformCapabilities:
readonly AssistantExecutiveGuidancePlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-4:6/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Published",
    sourceManifest: AssistantExecutiveGuidanceManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
