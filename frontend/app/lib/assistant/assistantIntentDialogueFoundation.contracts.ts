/** ASSISTANT-3:1 — Immutable descriptive Intent & Dialogue contracts. */
import type { AssistantIntentDialogueContractMetadata } from "./assistantIntentDialogueFoundation.types.ts";

const declarations = Object.freeze([
  [
    "Executive Intent Contract",
    "Defines the canonical Executive Intent domain.",
  ],
  [
    "Dialogue Understanding Contract",
    "Defines dialogue understanding metadata.",
  ],
  [
    "Dialogue Context Contract",
    "Defines dialogue context identity metadata.",
  ],
  [
    "Dialogue Turn Contract",
    "Defines dialogue turn metadata.",
  ],
  [
    "Intent Resolution Contract",
    "Defines intent resolution vocabulary metadata.",
  ],
  [
    "Intent Lifecycle Contract",
    "Defines intent lifecycle vocabulary metadata.",
  ],
  [
    "Dialogue Policy Contract",
    "Defines dialogue policy declarations.",
  ],
  [
    "Dialogue Boundary Contract",
    "Defines prohibited architectural surfaces.",
  ],
  [
    "Dialogue Capability Contract",
    "Defines dialogue capability declarations.",
  ],
] as const);

export const AssistantIntentDialogueFoundationContracts:
readonly AssistantIntentDialogueContractMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-3:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
