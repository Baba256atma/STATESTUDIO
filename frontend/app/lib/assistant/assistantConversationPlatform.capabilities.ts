/** ASSISTANT-1:6 — Exactly 12 immutable Platform capabilities. */
import { AssistantConversationManifest } from "./assistantConversationManifest.ts";
import type { AssistantConversationPlatformDeclaration } from "./assistantConversationPlatform.types.ts";

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
  "Readiness Publication",
  "Canonical Composition",
  "Public Platform Exposure",
] as const);

export const AssistantConversationPlatformCapabilities:
readonly AssistantConversationPlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-1:6/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Published",
    sourceManifest: AssistantConversationManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
