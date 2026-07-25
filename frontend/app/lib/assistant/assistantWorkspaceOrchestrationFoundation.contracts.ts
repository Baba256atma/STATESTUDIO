/** ASSISTANT-5:1 — Immutable descriptive Workspace Orchestration contracts. */
import type { AssistantWorkspaceOrchestrationContractMetadata } from "./assistantWorkspaceOrchestrationFoundation.types.ts";

const declarations = Object.freeze([
  [
    "Workspace Orchestration Contract",
    "Defines the canonical Workspace Orchestration domain.",
  ],
  [
    "Workspace Session Contract",
    "Defines workspace session identity metadata.",
  ],
  [
    "Workspace Context Contract",
    "Defines workspace context identity metadata.",
  ],
  [
    "Workspace Transition Contract",
    "Defines workspace transition vocabulary metadata.",
  ],
  [
    "Workspace Selection Contract",
    "Defines workspace selection vocabulary metadata.",
  ],
  [
    "Workspace Lifecycle Contract",
    "Defines workspace lifecycle vocabulary metadata.",
  ],
  [
    "Workspace Policy Contract",
    "Defines workspace policy declarations.",
  ],
  [
    "Workspace Boundary Contract",
    "Defines prohibited architectural surfaces.",
  ],
  [
    "Workspace Capability Contract",
    "Defines workspace capability declarations.",
  ],
] as const);

export const AssistantWorkspaceOrchestrationFoundationContracts:
readonly AssistantWorkspaceOrchestrationContractMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-5:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
