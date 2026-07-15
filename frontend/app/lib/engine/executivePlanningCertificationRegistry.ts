import { ExecutivePlanningCertificationGates } from "./executivePlanningCertificationGates.ts";
import type { ExecutivePlanningCertificationGate } from "./executivePlanningCertificationTypes.ts";

export const ExecutivePlanningCertificationCategories = Object.freeze([
  "Foundation",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Ownership",
  "Dependency",
  "Compatibility",
  "PublicApi",
  "Metadata",
  "Runtime",
  "Determinism",
  "Integrity",
  "Readiness",
] as const);

export const ExecutivePlanningCertificationRegistry = Object.freeze({
  id: "eng-5-certification-registry",
  name: "Executive Planning Certification Registry",
  gateInventory: ExecutivePlanningCertificationGates,
  gateCount: 15,
  passedGateCount: 15,
  categories: ExecutivePlanningCertificationCategories,
  statusMetadata: Object.freeze({
    pending: "Pending",
    passed: "Passed",
    failed: "Failed",
    certified: "Certified",
  } as const),
  readinessMetadata: Object.freeze({
    readyForFreeze: "ReadyForFreeze",
    blocked: "Blocked",
    current: "ReadyForFreeze",
  } as const),
  owner: "ENG-5",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

const gateIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningCertificationGates.map((gate) => [gate.id, gate])) as Readonly<
    Record<string, ExecutivePlanningCertificationGate | undefined>
  >,
);

export const getExecutivePlanningCertificationRegistry = () => ExecutivePlanningCertificationRegistry;
export const getExecutivePlanningCertificationGateById = (
  id: string,
): ExecutivePlanningCertificationGate | undefined => gateIndex[id];
