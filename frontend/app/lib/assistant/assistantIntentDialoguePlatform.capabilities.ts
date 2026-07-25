/** ASSISTANT-3:6 — Exactly 12 immutable Platform capabilities. */
import { AssistantIntentDialogueManifest } from "./assistantIntentDialogueManifest.ts";
import type { AssistantIntentDialoguePlatformDeclaration } from "./assistantIntentDialoguePlatform.types.ts";

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
  "Intent & Dialogue Composition",
  "Readiness Publication",
  "Public Platform Exposure",
] as const);

export const AssistantIntentDialoguePlatformCapabilities:
readonly AssistantIntentDialoguePlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-3:6/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Published",
    sourceManifest: AssistantIntentDialogueManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
