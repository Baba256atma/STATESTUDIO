/** ASSISTANT-8:7 — Exactly 16 immutable certification gates. */
import { ExecutiveActionExecutionPlatform } from "./executiveActionExecutionPlatform.ts";
import { ExecutionCertificationCriteria } from "./executionCertificationCriteria.ts";

const gates = Object.freeze([
  [
    "Foundation Gate",
    "Gate confirming Foundation compatibility certification.",
  ],
  [
    "Registry Gate",
    "Gate confirming Registry compatibility certification.",
  ],
  [
    "Model Gate",
    "Gate confirming Model compatibility certification.",
  ],
  [
    "Validation Gate",
    "Gate confirming Validation compatibility certification.",
  ],
  [
    "Manifest Gate",
    "Gate confirming Manifest compatibility certification.",
  ],
  [
    "Platform Gate",
    "Gate confirming Platform aggregate certification.",
  ],
  [
    "Identity Gate",
    "Gate confirming canonical identity certification.",
  ],
  [
    "Metadata Gate",
    "Gate confirming immutable metadata certification.",
  ],
  [
    "Relationship Gate",
    "Gate confirming relationship integrity certification.",
  ],
  [
    "Lifecycle Gate",
    "Gate confirming lifecycle integrity certification.",
  ],
  [
    "Policy Gate",
    "Gate confirming policy integrity certification.",
  ],
  [
    "Inventory Gate",
    "Gate confirming inventory integrity certification.",
  ],
  [
    "Compatibility Gate",
    "Gate confirming compatibility declaration certification.",
  ],
  [
    "Stability Gate",
    "Gate confirming platform stability certification.",
  ],
  [
    "Release Gate",
    "Gate confirming release eligibility certification.",
  ],
  [
    "Ready For Freeze",
    "Gate confirming ReadyForFreeze readiness certification.",
  ],
] as const);

export const ExecutionCertificationGates = Object.freeze(
  gates.map(([name, description], index) => Object.freeze({
    id: `ASSISTANT-8:7/Gate/${String(index + 1).padStart(2, "0")}`,
    name,
    description,
    declaredState: "Passed",
    evidenceCriteria: Object.freeze(
      ExecutionCertificationCriteria
        .slice(
          Math.min(index, ExecutionCertificationCriteria.length - 1),
          Math.min(index + 1, ExecutionCertificationCriteria.length),
        )
        .map(({ id }) => id),
    ),
    sourcePlatform: ExecutiveActionExecutionPlatform.identity.id,
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
