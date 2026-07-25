/** ASSISTANT-2:8 — Exactly 8 immutable Freeze compatibility declarations. */
import { AssistantExecutiveMemoryCertification } from "./assistantExecutiveMemoryCertification.ts";
import type { AssistantExecutiveMemoryFreezeCompatibilityMetadata } from "./assistantExecutiveMemoryFreeze.types.ts";

const names = Object.freeze([
  "Foundation Compatible",
  "Registry Compatible",
  "Model Compatible",
  "Validation Compatible",
  "Manifest Compatible",
  "Platform Compatible",
  "Certification Compatible",
  "Public Index Compatible",
] as const);

export const AssistantExecutiveMemoryFreezeCompatibility:
readonly AssistantExecutiveMemoryFreezeCompatibilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-2:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    sourceCertification: AssistantExecutiveMemoryCertification.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
