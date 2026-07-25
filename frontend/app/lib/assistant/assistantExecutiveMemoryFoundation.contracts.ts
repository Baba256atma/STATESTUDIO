/** ASSISTANT-2:1 — Immutable descriptive Executive Memory contracts. */
import type { AssistantExecutiveMemoryContractMetadata } from "./assistantExecutiveMemoryFoundation.types.ts";

const declarations = Object.freeze([
  [
    "Executive Memory Contract",
    "Defines the canonical Executive Memory domain.",
  ],
  [
    "Memory Context Contract",
    "Defines executive memory context metadata.",
  ],
  [
    "Memory Session Contract",
    "Defines memory session identity metadata.",
  ],
  [
    "Memory Scope Contract",
    "Defines conceptual memory scope metadata.",
  ],
  [
    "Memory Timeline Contract",
    "Defines memory timeline vocabulary metadata.",
  ],
  [
    "Memory Snapshot Contract",
    "Defines memory snapshot metadata.",
  ],
  [
    "Memory Lifecycle Contract",
    "Defines memory lifecycle vocabulary metadata.",
  ],
  [
    "Memory Policy Contract",
    "Defines memory policy declarations.",
  ],
  [
    "Memory Boundary Contract",
    "Defines prohibited architectural surfaces.",
  ],
] as const);

export const AssistantExecutiveMemoryFoundationContracts:
readonly AssistantExecutiveMemoryContractMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-2:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
