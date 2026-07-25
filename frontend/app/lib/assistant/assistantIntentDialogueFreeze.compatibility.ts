/** ASSISTANT-3:8 — Exactly 8 immutable Freeze compatibility declarations. */
import { AssistantIntentDialogueCertification } from "./assistantIntentDialogueCertification.ts";
import type { AssistantIntentDialogueFreezeCompatibilityMetadata } from "./assistantIntentDialogueFreeze.types.ts";

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

export const AssistantIntentDialogueFreezeCompatibility:
readonly AssistantIntentDialogueFreezeCompatibilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-3:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    sourceCertification: AssistantIntentDialogueCertification.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
