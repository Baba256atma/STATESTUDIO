/** ASSISTANT-8:1 — Immutable Executive Action Execution contracts. */
import type { ExecutiveActionExecutionContractMetadata } from "./executiveActionExecutionTypes.ts";

const declarations = Object.freeze([
  [
    "ExecutiveAction",
    "Canonical contract for an executable executive action representation.",
  ],
  [
    "ExecutionPlan",
    "Canonical contract for an approved plan transformed into execution metadata.",
  ],
  [
    "ExecutionStep",
    "Canonical contract for a discrete step within an Execution Plan.",
  ],
  [
    "ExecutionProgress",
    "Canonical contract for descriptive execution progress metadata.",
  ],
  [
    "ExecutionState",
    "Canonical contract for descriptive execution state classification.",
  ],
  [
    "ExecutionResult",
    "Canonical contract for intended or observed execution result metadata.",
  ],
  [
    "ExecutionFeedback",
    "Canonical contract for feedback collected during or after execution.",
  ],
  [
    "ExecutionException",
    "Canonical contract for exception and blockage metadata.",
  ],
  [
    "ExecutionCheckpoint",
    "Canonical contract for checkpoint tracking metadata.",
  ],
  [
    "ExecutionSnapshot",
    "Canonical contract for point-in-time execution snapshot metadata.",
  ],
  [
    "ExecutionHealth",
    "Canonical contract for execution health assessment metadata.",
  ],
  [
    "ExecutionSummary",
    "Canonical contract for executive-facing execution summary metadata.",
  ],
] as const);

export const ExecutiveActionExecutionContracts:
readonly ExecutiveActionExecutionContractMetadata[] = Object.freeze(
  declarations.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-8:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
