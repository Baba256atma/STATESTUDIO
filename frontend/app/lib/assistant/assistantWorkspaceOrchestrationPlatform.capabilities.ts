/** ASSISTANT-5:6 — Exactly 12 immutable Platform capabilities. */
import { AssistantWorkspaceOrchestrationManifest } from "./assistantWorkspaceOrchestrationManifest.ts";
import type { AssistantWorkspaceOrchestrationPlatformDeclaration } from "./assistantWorkspaceOrchestrationPlatform.types.ts";

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
  "Workspace Orchestration Composition",
  "Readiness Publication",
  "Public Platform Exposure",
] as const);

export const AssistantWorkspaceOrchestrationPlatformCapabilities:
readonly AssistantWorkspaceOrchestrationPlatformDeclaration[] = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `ASSISTANT-5:6/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Published",
    sourceManifest: AssistantWorkspaceOrchestrationManifest.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
