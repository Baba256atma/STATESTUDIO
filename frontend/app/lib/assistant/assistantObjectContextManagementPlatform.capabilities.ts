/** ASSISTANT-6:6 — Exactly 12 immutable Platform capabilities. */
import { AssistantObjectContextManagementManifest } from "./assistantObjectContextManagementManifest.ts";
import type { AssistantObjectContextManagementPlatformDeclaration } from "./assistantObjectContextManagementPlatform.types.ts";

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
  "Object & Context Composition",
  "Readiness Publication",
  "Public Platform Exposure",
] as const);

export const AssistantObjectContextManagementPlatformCapabilities:
readonly AssistantObjectContextManagementPlatformDeclaration[] =
  Object.freeze(
    names.map((name, index) => Object.freeze({
      id: `ASSISTANT-6:6/Capability/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Published",
      sourceManifest: AssistantObjectContextManagementManifest.identity.id,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    })),
  );
