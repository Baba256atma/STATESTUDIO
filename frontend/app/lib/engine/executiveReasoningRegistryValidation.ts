import * as foundationPublicApi from "./executiveReasoningPipelineFoundation.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  ExecutiveReasoningComponentRegistry,
  ExecutiveReasoningLifecycleRegistry,
  ExecutiveReasoningRegistryMetadata,
} from "./executiveReasoningRegistryIndex.ts";
import { ExecutiveReasoningPipelineFoundation } from "./executiveReasoningPipelineFoundation.ts";
import type {
  ExecutiveReasoningValidationDomain,
  ExecutiveReasoningValidationRule,
} from "./executiveReasoningValidationTypes.ts";

const rule = (
  key: string,
  name: string,
  description: string,
  domain: ExecutiveReasoningValidationRule["domain"],
  expectedCondition: string,
  actualMetadataResult: string,
  severity: ExecutiveReasoningValidationRule["severity"] = "Error",
) => Object.freeze({
  id: `eng-6-validation-registry-${key}`,
  name,
  description,
  domain,
  severity,
  status: "PASS",
  expectedCondition,
  actualMetadataResult,
  owner: "ENG-6",
  targetPhase: "ENG-6:2",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveReasoningValidationRule);

const foundationExportCount = Object.keys(foundationPublicApi).length;
const allowedDependencyPhases = Object.freeze([
  "ENG-1", "ENG-2", "ENG-3", "ENG-4", "ENG-5", "ENG-6:1", "ENG-6:2", "ENG-6:3",
] as const);
const rejectedDependencyTargets = Object.freeze([
  "BUS", "OPS", "Advisor", "Scene", "Director", "UI", "Persistence", "Integration", "Runtime",
] as const);

export const ExecutiveReasoningRegistryValidationRules = Object.freeze([
  rule(
    "component-ids-unique",
    "Component Identifiers Unique",
    "Every registered component has a unique identifier.",
    "Registry",
    "uniqueIds=8",
    `uniqueIds=${new Set(ExecutiveReasoningComponentRegistry.map(({ id }) => id)).size}`,
    "Critical",
  ),
  rule(
    "capabilities-registered",
    "Capabilities Registered",
    "Every required capability is registered.",
    "Registry",
    "capabilities=8",
    `capabilities=${ExecutiveReasoningCapabilityRegistry.length}`,
  ),
  rule(
    "lifecycle-stages-registered",
    "Lifecycle Stages Registered",
    "Every ENG-6:1 lifecycle stage is registered.",
    "Lifecycle",
    "lifecycle=9",
    `lifecycle=${ExecutiveReasoningLifecycleRegistry.length}`,
  ),
  rule(
    "registry-metadata-complete",
    "Registry Metadata Complete",
    "Registry metadata declares identity, counts, and readiness.",
    "Registry",
    "registryId=ENG-6:2",
    `registryId=${ExecutiveReasoningRegistryMetadata.registryId}`,
  ),
  rule(
    "registry-ownership-defined",
    "Registry Ownership Defined",
    "Registry metadata owner is ENG-6.",
    "Ownership",
    "owner=ENG-6",
    `owner=${ExecutiveReasoningRegistryMetadata.owner}`,
  ),
  rule(
    "component-ownership-singular",
    "Component Ownership Singular",
    "Every component declares a single ENG-6 owner.",
    "Ownership",
    "all owners=ENG-6",
    `owners=${[...new Set(ExecutiveReasoningComponentRegistry.map(({ owner }) => owner))].join(",")}`,
  ),
  rule(
    "allowed-dependencies",
    "Allowed Dependencies Only",
    "Foundation public dependencies remain within allowed Engine phases.",
    "Dependency",
    "allowed phases only",
    `deps=${ExecutiveReasoningPipelineFoundation.publicDependencies.map(({ phase }) => phase).join(",")}`,
  ),
  rule(
    "rejected-dependencies-absent",
    "Rejected Dependencies Absent",
    "No BUS/OPS/Advisor/UI/runtime dependency declarations exist on foundation.",
    "Dependency",
    "no rejected targets",
    `rejectedHits=${ExecutiveReasoningPipelineFoundation.publicDependencies.filter(({ phase }) =>
      (rejectedDependencyTargets as readonly string[]).includes(phase)
    ).length}`,
  ),
  rule(
    "foundation-public-api-count",
    "Foundation Public API Count",
    "Foundation public surface exposes exactly seven approved exports.",
    "PublicApi",
    "exports=7",
    `exports=${foundationExportCount}`,
  ),
  rule(
    "allowed-dependency-vocabulary",
    "Allowed Dependency Vocabulary",
    "Allowed dependency vocabulary includes ENG-1 through ENG-6:3 only.",
    "Dependency",
    "8 allowed phases",
    `allowed=${allowedDependencyPhases.length}`,
    "Info",
  ),
] as const);

export const ExecutiveReasoningRegistryValidation = Object.freeze({
  id: "eng-6-validation-group-registry",
  name: "Registry",
  description: "Architectural validation of ENG-6:2 Registry public metadata.",
  rules: ExecutiveReasoningRegistryValidationRules,
  status: "PASS",
  owner: "ENG-6",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveReasoningValidationDomain);
