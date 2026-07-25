/** ASSISTANT-4:1 — Immutable descriptive Executive Guidance contracts. */
import type { AssistantExecutiveGuidanceContractMetadata } from "./assistantExecutiveGuidanceFoundation.types.ts";

const declarations = Object.freeze([
  [
    "Executive Guidance Contract",
    "Defines the canonical Executive Guidance domain.",
  ],
  [
    "Guidance Session Contract",
    "Defines guidance session identity metadata.",
  ],
  [
    "Guidance Context Contract",
    "Defines guidance context identity metadata.",
  ],
  [
    "Guidance Strategy Contract",
    "Defines guidance strategy vocabulary metadata.",
  ],
  [
    "Guidance Objective Contract",
    "Defines guidance objective vocabulary metadata.",
  ],
  [
    "Guidance Lifecycle Contract",
    "Defines guidance lifecycle vocabulary metadata.",
  ],
  [
    "Guidance Policy Contract",
    "Defines guidance policy declarations.",
  ],
  [
    "Guidance Boundary Contract",
    "Defines prohibited architectural surfaces.",
  ],
  [
    "Guidance Capability Contract",
    "Defines guidance capability declarations.",
  ],
] as const);

export const AssistantExecutiveGuidanceFoundationContracts:
readonly AssistantExecutiveGuidanceContractMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-4:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
