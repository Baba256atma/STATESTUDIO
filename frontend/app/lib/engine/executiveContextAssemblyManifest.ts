import {
  ExecutiveContextAssemblyComponentManifest,
  ExecutiveContextAssemblyManifestInventories,
  ExecutiveContextAssemblyPublicHelperApis,
} from "./executiveContextAssemblyComponentManifest.ts";
import { ExecutiveContextAssemblyDependencyManifest } from "./executiveContextAssemblyDependencyManifest.ts";
import {
  ExecutiveContextAssemblyCompatibilityManifest,
  ExecutiveContextAssemblyOwnershipManifest,
} from "./executiveContextAssemblyOwnershipManifest.ts";
import { ExecutiveContextAssemblyPhaseManifest } from "./executiveContextAssemblyPhaseManifest.ts";
import {
  ExecutiveContextAssemblyGuaranteeManifest,
  ExecutiveContextAssemblyReadinessManifest,
} from "./executiveContextAssemblyReadinessManifest.ts";
import { ExecutiveContextAssemblyValidation } from "./executiveContextAssemblyValidation.ts";
import type {
  ExecutiveContextAssemblyManifestAggregate,
  ExecutiveContextManifestComponent,
  ExecutiveContextManifestMetadata,
  ExecutiveContextManifestPhase,
  ExecutiveContextManifestReadinessGate,
  ExecutiveContextManifestSummary,
} from "./executiveContextAssemblyManifestTypes.ts";

const metadata = Object.freeze({
  manifestId: "ENG-4:5",
  version: "1.0.0",
  name: "Executive Context Assembly Manifest",
  description: "Canonical metadata-only aggregation manifest for the complete ENG-4:1–ENG-4:4 Executive Context Assembly architecture.",
  namespace: "nexora.engine.executive.context-assembly.manifest",
  phase: "ENG-4:5",
  owner: "ENG-4",
  phaseCount: ExecutiveContextAssemblyPhaseManifest.length,
  componentCount: ExecutiveContextAssemblyComponentManifest.length,
  dependencyCount: ExecutiveContextAssemblyDependencyManifest.length,
  publicApiCount: ExecutiveContextAssemblyPublicHelperApis.length,
  validationRuleCount: ExecutiveContextAssemblyManifestInventories.validationRules,
  readinessGateCount: ExecutiveContextAssemblyReadinessManifest.length,
  status: Object.freeze({
    manifest: "Manifest",
    complete: "Complete",
    validated: "Validated",
    metadataOnly: "MetadataOnly",
    immutable: "Immutable",
    runtimeFree: "RuntimeFree",
    deterministic: "Deterministic",
    readyForPlatform: "ReadyForPlatform",
  } as const),
  nextPhase: "ENG-4:6",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextManifestMetadata);

const summary = Object.freeze({
  manifestId: "ENG-4:5",
  phase: "ENG-4:5",
  namespace: "nexora.engine.executive.context-assembly.manifest",
  owner: "ENG-4",
  completedPhaseCount: 4,
  componentCount: ExecutiveContextAssemblyComponentManifest.length,
  dependencyCount: ExecutiveContextAssemblyDependencyManifest.length,
  inventoryDomainCount: ExecutiveContextAssemblyManifestInventories.contextDomains,
  inventorySourceCount: ExecutiveContextAssemblyManifestInventories.contextSources,
  inventoryCapabilityCount: ExecutiveContextAssemblyManifestInventories.capabilities,
  inventoryLifecycleCount: ExecutiveContextAssemblyManifestInventories.lifecycleStages,
  validationGroupCount: ExecutiveContextAssemblyManifestInventories.validationGroups,
  validationRuleCount: ExecutiveContextAssemblyManifestInventories.validationRules,
  validationGateCount: ExecutiveContextAssemblyManifestInventories.validationGates,
  readinessGateCount: ExecutiveContextAssemblyReadinessManifest.length,
  publicApiCount: ExecutiveContextAssemblyPublicHelperApis.length,
  status: "ReadyForPlatform",
  nextPhase: "ENG-4:6",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextManifestSummary);

export const ExecutiveContextAssemblyManifest = Object.freeze({
  metadata,
  phases: ExecutiveContextAssemblyPhaseManifest,
  components: ExecutiveContextAssemblyComponentManifest,
  inventories: ExecutiveContextAssemblyManifestInventories,
  dependencies: ExecutiveContextAssemblyDependencyManifest,
  ownership: ExecutiveContextAssemblyOwnershipManifest,
  compatibility: ExecutiveContextAssemblyCompatibilityManifest,
  guarantees: ExecutiveContextAssemblyGuaranteeManifest,
  validation: ExecutiveContextAssemblyValidation,
  readiness: ExecutiveContextAssemblyReadinessManifest,
  publicApis: ExecutiveContextAssemblyPublicHelperApis,
  summary,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveContextAssemblyManifestAggregate);

const phaseIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyPhaseManifest.map((phase) => [phase.phaseId, phase])) as Readonly<
    Record<string, ExecutiveContextManifestPhase | undefined>
  >,
);
const componentIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyComponentManifest.map((component) => [component.id, component])) as Readonly<
    Record<string, ExecutiveContextManifestComponent | undefined>
  >,
);
const readinessIndex = Object.freeze(
  Object.fromEntries(ExecutiveContextAssemblyReadinessManifest.map((gate) => [gate.id, gate])) as Readonly<
    Record<string, ExecutiveContextManifestReadinessGate | undefined>
  >,
);

export { ExecutiveContextAssemblyComponentManifest } from "./executiveContextAssemblyComponentManifest.ts";
export { ExecutiveContextAssemblyDependencyManifest } from "./executiveContextAssemblyDependencyManifest.ts";
export {
  ExecutiveContextAssemblyCompatibilityManifest,
  ExecutiveContextAssemblyOwnershipManifest,
} from "./executiveContextAssemblyOwnershipManifest.ts";
export { ExecutiveContextAssemblyPhaseManifest } from "./executiveContextAssemblyPhaseManifest.ts";
export {
  ExecutiveContextAssemblyGuaranteeManifest,
  ExecutiveContextAssemblyReadinessManifest,
} from "./executiveContextAssemblyReadinessManifest.ts";

export const getExecutiveContextAssemblyManifest = () => ExecutiveContextAssemblyManifest;
export const getExecutiveContextAssemblyManifestMetadata = () => metadata;
export const getExecutiveContextAssemblyPhaseManifest = () => ExecutiveContextAssemblyPhaseManifest;
export const getExecutiveContextAssemblyComponentManifest = () => ExecutiveContextAssemblyComponentManifest;
export const getExecutiveContextAssemblyDependencyManifest = () => ExecutiveContextAssemblyDependencyManifest;
export const getExecutiveContextAssemblyOwnershipManifest = () => ExecutiveContextAssemblyOwnershipManifest;
export const getExecutiveContextAssemblyReadinessManifest = () => ExecutiveContextAssemblyReadinessManifest;
export const getExecutiveContextAssemblyManifestSummary = () => summary;

export const getExecutiveContextAssemblyManifestPhaseById = (
  id: string,
): ExecutiveContextManifestPhase | undefined => phaseIndex[id];
export const getExecutiveContextAssemblyManifestComponentById = (
  id: string,
): ExecutiveContextManifestComponent | undefined => componentIndex[id];
export const getExecutiveContextAssemblyManifestReadinessGateById = (
  id: string,
): ExecutiveContextManifestReadinessGate | undefined => readinessIndex[id];
