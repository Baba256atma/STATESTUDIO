/** ASSISTANT-6:1 — Immutable descriptive Object & Context Management contracts. */
import type { AssistantObjectContextManagementContractMetadata } from "./assistantObjectContextManagementFoundation.types.ts";

const declarations = Object.freeze([
  [
    "Object Context Management Contract",
    "Defines the canonical Object & Context Management domain.",
  ],
  [
    "Executive Object Contract",
    "Defines executive object identity metadata.",
  ],
  [
    "Object Identity Contract",
    "Defines object identity vocabulary metadata.",
  ],
  [
    "Object Context Contract",
    "Defines object context identity metadata.",
  ],
  [
    "Context Scope Contract",
    "Defines context scope vocabulary metadata.",
  ],
  [
    "Context Session Contract",
    "Defines context session vocabulary metadata.",
  ],
  [
    "Context Lifecycle Contract",
    "Defines context lifecycle vocabulary metadata.",
  ],
  [
    "Context Boundary Contract",
    "Defines prohibited architectural surfaces.",
  ],
  [
    "Context Capability Contract",
    "Defines context capability declarations.",
  ],
] as const);

export const AssistantObjectContextManagementFoundationContracts:
readonly AssistantObjectContextManagementContractMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-6:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
