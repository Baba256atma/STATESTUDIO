/** ASSISTANT-6:8 — Exactly 8 immutable Freeze compatibility declarations. */
import { AssistantObjectContextManagementCertification } from "./assistantObjectContextManagementCertification.ts";
import type { AssistantObjectContextManagementFreezeCompatibilityMetadata } from "./assistantObjectContextManagementFreeze.types.ts";

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

export const AssistantObjectContextManagementFreezeCompatibility:
readonly AssistantObjectContextManagementFreezeCompatibilityMetadata[] =
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id: `ASSISTANT-6:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      sourceCertification:
        AssistantObjectContextManagementCertification.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );
