/** ASSISTANT-4:6 — Exactly 12 immutable compatibility declarations. */
import { AssistantExecutiveGuidanceManifest } from "./assistantExecutiveGuidanceManifest.ts";
import type { AssistantExecutiveGuidancePlatformDeclaration } from "./assistantExecutiveGuidancePlatform.types.ts";

const names = Object.freeze([
  "Foundation Compatible",
  "Registry Compatible",
  "Model Compatible",
  "Validation Compatible",
  "Manifest Compatible",
  "Certification Compatible",
  "Freeze Compatible",
  "Public Index Compatible",
  "TypeScript Compatible",
  "ESLint Compatible",
  "Metadata Compatible",
  "Consumer Compatible",
] as const);

export const AssistantExecutiveGuidancePlatformCompatibility:
readonly AssistantExecutiveGuidancePlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-4:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    sourceManifest: AssistantExecutiveGuidanceManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
