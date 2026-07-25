/** ASSISTANT-4:8 — Exactly 8 immutable Freeze compatibility declarations. */
import { AssistantExecutiveGuidanceCertification } from "./assistantExecutiveGuidanceCertification.ts";
import type { AssistantExecutiveGuidanceFreezeCompatibilityMetadata } from "./assistantExecutiveGuidanceFreeze.types.ts";

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

export const AssistantExecutiveGuidanceFreezeCompatibility:
readonly AssistantExecutiveGuidanceFreezeCompatibilityMetadata[] =
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id: `ASSISTANT-4:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      sourceCertification: AssistantExecutiveGuidanceCertification.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );
