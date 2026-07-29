/**
 * EX-1:6 — Executive Stage Inspection Service.
 *
 * Stage diagnostics contracts. Inspection never modifies Stage or Runtime.
 *
 * Ownership: owned exclusively by EX-1:6.
 */

/** Canonical inspection capability name. */
export type ExecutiveStageInspectionCapabilityName =
  | "Current Lifecycle"
  | "Active Runtime Version"
  | "Layer Inventory"
  | "Event History"
  | "Platform Version"
  | "Health Summary";

/** Inspection capability declaration. */
export interface ExecutiveStageInspectionCapability {
  readonly capabilityId: string;
  readonly capabilityName: ExecutiveStageInspectionCapabilityName;
  readonly description: string;
  readonly order: number;
  readonly modifiesStage: false;
  readonly modifiesRuntime: false;
  readonly readOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const capability = (
  capabilityName: ExecutiveStageInspectionCapabilityName,
  description: string,
  order: number,
): ExecutiveStageInspectionCapability =>
  Object.freeze({
    capabilityId: `EX-1:6/Inspection/${String(order).padStart(2, "0")}`,
    capabilityName,
    description,
    order,
    modifiesStage: false as const,
    modifiesRuntime: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly six inspection capabilities. */
export const ExecutiveStageInspectionCapabilities = Object.freeze([
  capability(
    "Current Lifecycle",
    "Inspect the current Stage lifecycle state.",
    1,
  ),
  capability(
    "Active Runtime Version",
    "Inspect the attached Runtime Public Index version.",
    2,
  ),
  capability(
    "Layer Inventory",
    "Inspect the Stage layer inventory.",
    3,
  ),
  capability(
    "Event History",
    "Inspect Stage event history metadata.",
    4,
  ),
  capability(
    "Platform Version",
    "Inspect Platform version metadata.",
    5,
  ),
  capability(
    "Health Summary",
    "Inspect Platform health summary.",
    6,
  ),
] as const);

export const ExecutiveStageInspectionCapabilityNames = Object.freeze([
  "Current Lifecycle",
  "Active Runtime Version",
  "Layer Inventory",
  "Event History",
  "Platform Version",
  "Health Summary",
] as const satisfies readonly ExecutiveStageInspectionCapabilityName[]);

/** Inspection service catalogue. */
export const ExecutiveStageInspectionService = Object.freeze({
  serviceId: "EX-1:6/InspectionService",
  capabilities: ExecutiveStageInspectionCapabilities,
  capabilityNames: ExecutiveStageInspectionCapabilityNames,
  capabilityCount: ExecutiveStageInspectionCapabilities.length,
  readOnly: true as const,
  modifiesStage: false as const,
  modifiesRuntime: false as const,
  affectsExecution: false as const,
  contractsOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
