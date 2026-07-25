/** ASSISTANT-1:8 — Exactly 8 immutable Freeze compatibility declarations. */
import { AssistantConversationCertification } from "./assistantConversationCertification.ts";
import type { AssistantConversationFreezeCompatibilityMetadata } from "./assistantConversationFreeze.types.ts";

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

export const AssistantConversationFreezeCompatibility:
readonly AssistantConversationFreezeCompatibilityMetadata[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-1:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    sourceCertification: AssistantConversationCertification.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
