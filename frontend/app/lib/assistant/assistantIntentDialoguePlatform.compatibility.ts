/** ASSISTANT-3:6 — Exactly 12 immutable compatibility declarations. */
import { AssistantIntentDialogueManifest } from "./assistantIntentDialogueManifest.ts";
import type { AssistantIntentDialoguePlatformDeclaration } from "./assistantIntentDialoguePlatform.types.ts";

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

export const AssistantIntentDialoguePlatformCompatibility:
readonly AssistantIntentDialoguePlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-3:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    sourceManifest: AssistantIntentDialogueManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
