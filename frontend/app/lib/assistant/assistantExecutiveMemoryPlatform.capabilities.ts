/** ASSISTANT-2:6 — Exactly 12 immutable Platform capabilities. */
import { AssistantExecutiveMemoryManifest } from "./assistantExecutiveMemoryManifest.ts";
import type { AssistantExecutiveMemoryPlatformDeclaration } from "./assistantExecutiveMemoryPlatform.types.ts";

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
  "Executive Memory Composition",
  "Readiness Publication",
  "Public Platform Exposure",
] as const);

export const AssistantExecutiveMemoryPlatformCapabilities:
readonly AssistantExecutiveMemoryPlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-2:6/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Published",
    sourceManifest: AssistantExecutiveMemoryManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
