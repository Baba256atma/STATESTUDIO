/** ASSISTANT-1:6 — Exactly 12 immutable compatibility declarations. */
import { AssistantConversationManifest } from "./assistantConversationManifest.ts";
import type { AssistantConversationPlatformDeclaration } from "./assistantConversationPlatform.types.ts";

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

export const AssistantConversationPlatformCompatibility:
readonly AssistantConversationPlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-1:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    sourceManifest: AssistantConversationManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
