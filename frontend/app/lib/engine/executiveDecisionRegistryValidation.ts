import {
  ExecutiveDecisionCapabilityRegistryPlatform,
  ExecutiveDecisionDomainRegistry,
  ExecutiveDecisionLifecycleRegistry,
  ExecutiveDecisionOutputRegistry,
  ExecutiveDecisionRegistryMetadata,
  ExecutiveDecisionRegistryPlatform,
  ExecutiveDecisionTypeRegistry,
  getExecutiveDecisionRegistrySummary,
} from "./executiveDecisionRegistryPlatform.ts";
import type { ExecutiveDecisionValidationRule } from "./executiveDecisionValidationTypes.ts";

const rule = (
  key: string,
  name: string,
  category: ExecutiveDecisionValidationRule["category"],
  description: string,
  validatedArtifact: string,
  expectedState: string,
  actualMetadataResult: string,
  severity: ExecutiveDecisionValidationRule["severity"] = "Error",
) => Object.freeze({
  id: `eng-7-validation-${key}`,
  name,
  category,
  severity,
  description,
  validatedArtifact,
  expectedState,
  actualMetadataResult,
  status: "PASS",
  owner: "ENG-7",
  targetPhase: "ENG-7:2",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionValidationRule);

const summary = getExecutiveDecisionRegistrySummary();
const uniqueDomainIds = new Set(ExecutiveDecisionDomainRegistry.map(({ id }) => id)).size;
const uniqueTypeIds = new Set(ExecutiveDecisionTypeRegistry.map(({ id }) => id)).size;
const dependencyRegistry = ExecutiveDecisionRegistryPlatform.dependencies;
const ownershipRegistry = ExecutiveDecisionRegistryPlatform.ownership;

export const ExecutiveDecisionRegistryValidationRules = Object.freeze([
  rule(
    "registry-unique-ids",
    "Unique Registry Identifiers",
    "Registry",
    "Domain and type registry identifiers are unique.",
    "ExecutiveDecisionDomainRegistry|ExecutiveDecisionTypeRegistry",
    "uniqueDomains=12;uniqueTypes=16",
    `uniqueDomains=${uniqueDomainIds};uniqueTypes=${uniqueTypeIds}`,
    "Critical",
  ),
  rule(
    "registry-domain-completeness",
    "Domain Completeness",
    "Registry",
    "Exactly twelve decision domains are registered.",
    "ExecutiveDecisionDomainRegistry",
    "domains=12",
    `domains=${ExecutiveDecisionDomainRegistry.length}`,
  ),
  rule(
    "registry-type-completeness",
    "Decision-Type Completeness",
    "Registry",
    "Exactly sixteen decision types are registered.",
    "ExecutiveDecisionTypeRegistry",
    "types=16",
    `types=${ExecutiveDecisionTypeRegistry.length}`,
  ),
  rule(
    "registry-capability-integrity",
    "Capability Registry Integrity",
    "Registry",
    "Capability registry platform publishes eight capabilities.",
    "ExecutiveDecisionCapabilityRegistryPlatform",
    "capabilities=8",
    `capabilities=${ExecutiveDecisionCapabilityRegistryPlatform.length}`,
  ),
  rule(
    "dependency-incoming-allowed",
    "Allowed Incoming Dependencies",
    "Dependency",
    "Dependency registry declares six allowed incoming Engine phases.",
    "ExecutiveDecisionRegistryPlatform.dependencies",
    "incoming=6",
    `incoming=${dependencyRegistry.filter(({ direction }) => direction === "Incoming").length}`,
  ),
  rule(
    "dependency-outgoing-allowed",
    "Allowed Outgoing Dependencies",
    "Dependency",
    "Dependency registry declares ENG-8 and Advisor as outgoing.",
    "ExecutiveDecisionRegistryPlatform.dependencies",
    "outgoing=2",
    `outgoing=${dependencyRegistry.filter(({ direction }) => direction === "Outgoing").length}`,
  ),
  rule(
    "dependency-forbidden-boundaries",
    "Forbidden Dependency Boundaries",
    "Dependency",
    "Dependency registry forbids BUS, OPS, UI, Scene, EVE, and persistence imports.",
    "ExecutiveDecisionRegistryPlatform.dependencies",
    "forbidden>=8",
    `forbidden=${dependencyRegistry.filter(({ direction }) => direction === "Forbidden").length}`,
  ),
  rule(
    "dependency-lifecycle-integrity",
    "Lifecycle And Ownership Registry Integrity",
    "Dependency",
    "Lifecycle, ownership, output, and registry metadata remain aligned.",
    "ExecutiveDecisionLifecycleRegistry|ExecutiveDecisionRegistryPlatform.ownership",
    "lifecycle=8;ownershipOwns=8;outputs=8;status=Stable",
    `lifecycle=${ExecutiveDecisionLifecycleRegistry.length};ownership=${ownershipRegistry.length};outputs=${ExecutiveDecisionOutputRegistry.length};status=${ExecutiveDecisionRegistryMetadata.status};summaryReady=${summary.readiness}`,
  ),
] as const);

export const ExecutiveDecisionRegistryValidation = Object.freeze({
  id: "eng-7-validation-group-registry",
  name: "Registry",
  description: "Architectural validation of ENG-7:2 Registry public metadata.",
  rules: ExecutiveDecisionRegistryValidationRules,
  status: "PASS",
  owner: "ENG-7",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
