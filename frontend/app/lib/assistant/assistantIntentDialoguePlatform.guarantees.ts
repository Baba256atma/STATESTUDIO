/** ASSISTANT-3:6 — Exactly 18 immutable Platform guarantees. */
import { AssistantIntentDialogueManifest } from "./assistantIntentDialogueManifest.ts";
import type { AssistantIntentDialoguePlatformDeclaration } from "./assistantIntentDialoguePlatform.types.ts";

const names = Object.freeze([
  "Canonical Composition",
  "Immutable Metadata",
  "Stable Identity",
  "Foundation Integrity",
  "Registry Integrity",
  "Model Integrity",
  "Validation Integrity",
  "Manifest Integrity",
  "Export Stability",
  "Namespace Stability",
  "Dependency Integrity",
  "Compatibility Integrity",
  "Version Stability",
  "Consumer Safety",
  "Metadata Traceability",
  "Architecture Consistency",
  "Public Metadata Integrity",
  "ReadyForCertification",
] as const);

export const AssistantIntentDialoguePlatformGuarantees:
readonly AssistantIntentDialoguePlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-3:6/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Guaranteed",
    sourceManifest: AssistantIntentDialogueManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
