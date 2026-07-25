/** ASSISTANT-1:6 — Exactly 18 immutable Platform guarantees. */
import { AssistantConversationManifest } from "./assistantConversationManifest.ts";
import type { AssistantConversationPlatformDeclaration } from "./assistantConversationPlatform.types.ts";

const names = Object.freeze([
  "Canonical Composition",
  "Immutable Metadata",
  "Stable Identity",
  "Manifest Integrity",
  "Registry Preservation",
  "Model Preservation",
  "Validation Preservation",
  "Lifecycle Preservation",
  "Export Stability",
  "Namespace Stability",
  "Dependency Integrity",
  "Compatibility Integrity",
  "Version Stability",
  "Consumer Safety",
  "Public Metadata Integrity",
  "Architecture Consistency",
  "Metadata Traceability",
  "ReadyForCertification",
] as const);

export const AssistantConversationPlatformGuarantees:
readonly AssistantConversationPlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-1:6/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Guaranteed",
    sourceManifest: AssistantConversationManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
