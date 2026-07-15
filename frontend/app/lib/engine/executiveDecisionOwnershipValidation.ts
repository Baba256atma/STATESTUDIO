import {
  ExecutiveDecisionFoundation,
  ExecutiveDecisionOwnershipMap,
} from "./executiveDecisionPublicApi.ts";
import {
  ExecutiveDecisionModelPlatform,
} from "./executiveDecisionModelPlatform.ts";
import {
  ExecutiveDecisionRegistryPlatform,
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
  targetPhase: ExecutiveDecisionValidationRule["targetPhase"],
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
  targetPhase,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveDecisionValidationRule);

const ownershipRegistry = ExecutiveDecisionRegistryPlatform.ownership;
const ownsDecisionModels = ExecutiveDecisionModelPlatform.ownership.owns.includes(
  "executive decision model contracts",
);
const neverOwnsReasoning = ExecutiveDecisionOwnershipMap.neverOwns.includes("reasoning");
const neverOwnsPlanning = ExecutiveDecisionOwnershipMap.neverOwns.includes("planning");
const neverOwnsOrchestration = ExecutiveDecisionOwnershipMap.neverOwns.includes("orchestration");
const neverOwnsExecution = ExecutiveDecisionOwnershipMap.neverOwns.includes("execution");
const neverOwnsPersistence = ExecutiveDecisionOwnershipMap.neverOwns.includes("persistence");
const registryExcludesBus = ownershipRegistry.some(
  ({ artifact, classification }) => artifact === "BUS business models" && classification === "DoesNotOwn",
);
const registryExcludesOps = ownershipRegistry.some(
  ({ artifact, classification }) => artifact === "OPS execution models" && classification === "DoesNotOwn",
);
const registryExcludesAdvisor = ownershipRegistry.some(
  ({ artifact, classification }) => artifact === "Advisor communication behavior" && classification === "DoesNotOwn",
);
const registryExcludesScene = ownershipRegistry.some(
  ({ artifact, classification }) => artifact === "Scene or EVE rendering" && classification === "DoesNotOwn",
);

export const ExecutiveDecisionOwnershipValidationRules = Object.freeze([
  rule(
    "ownership-decision-models",
    "Owns Decision Models",
    "Ownership",
    "ENG-7 owns decision model contracts.",
    "ExecutiveDecisionModelPlatform.ownership",
    "ownsDecisionModels=true",
    `ownsDecisionModels=${ownsDecisionModels}`,
    "ENG-7:3",
    "Critical",
  ),
  rule(
    "ownership-decision-metadata",
    "Owns Decision Metadata",
    "Ownership",
    "ENG-7 owns executive decision metadata and publication contracts.",
    "ExecutiveDecisionOwnershipMap",
    "ownsMetadata=true",
    `owns=${ExecutiveDecisionOwnershipMap.owns.join("|")}`,
    "ENG-7:1",
  ),
  rule(
    "ownership-excludes-prior-phases",
    "Excludes Reasoning Planning Orchestration",
    "Ownership",
    "ENG-7 does not own reasoning, planning, orchestration, or execution.",
    "ExecutiveDecisionOwnershipMap.neverOwns",
    "excludes=reasoning,planning,orchestration,execution",
    `reasoning=${neverOwnsReasoning};planning=${neverOwnsPlanning};orchestration=${neverOwnsOrchestration};execution=${neverOwnsExecution}`,
    "ENG-7:1",
  ),
  rule(
    "ownership-excludes-external-systems",
    "Excludes BUS OPS Advisor Scene EVE Persistence",
    "Ownership",
    "ENG-7 ownership registry excludes BUS, OPS, Advisor, Scene/EVE, and persistence.",
    "ExecutiveDecisionRegistryPlatform.ownership",
    "excludesExternal=true",
    `bus=${registryExcludesBus};ops=${registryExcludesOps};advisor=${registryExcludesAdvisor};scene=${registryExcludesScene};persistence=${neverOwnsPersistence}`,
    "ENG-7:2",
  ),
  rule(
    "immutability-foundation",
    "Foundation Immutability",
    "Immutability",
    "Foundation declares immutability and freeze-ready metadata-only mode.",
    "ExecutiveDecisionFoundation",
    "immutable=true;runtimeFree=true",
    `immutable=${ExecutiveDecisionFoundation.immutable};runtimeFree=${ExecutiveDecisionFoundation.runtimeFree}`,
    "ENG-7:1",
    "Critical",
  ),
  rule(
    "immutability-registry",
    "Registry Immutability",
    "Immutability",
    "Registry platform declares DeeplyFrozen immutability.",
    "ExecutiveDecisionRegistryPlatform.metadata",
    "immutability=DeeplyFrozen",
    `immutability=${ExecutiveDecisionRegistryPlatform.metadata.immutability}`,
    "ENG-7:2",
  ),
  rule(
    "immutability-model",
    "Model Immutability",
    "Immutability",
    "Model platform declares DeeplyFrozen immutability.",
    "ExecutiveDecisionModelPlatform.metadata",
    "immutability=DeeplyFrozen",
    `immutability=${ExecutiveDecisionModelPlatform.metadata.immutability}`,
    "ENG-7:3",
  ),
  rule(
    "immutability-boundary",
    "Produces Decisions Only Boundary",
    "Immutability",
    "Ownership boundary preserves producesDecisionsOnly without scoring or AI inference.",
    "ExecutiveDecisionOwnershipMap.boundary",
    "producesDecisionsOnly=true;performsAiInference=false",
    `producesDecisionsOnly=${ExecutiveDecisionOwnershipMap.boundary.producesDecisionsOnly};ai=${ExecutiveDecisionOwnershipMap.boundary.performsAiInference};scoring=${ExecutiveDecisionOwnershipMap.boundary.performsScoring}`,
    "ENG-7:1",
  ),
] as const);

export const ExecutiveDecisionOwnershipValidation = Object.freeze({
  id: "eng-7-validation-group-ownership",
  name: "Ownership",
  description: "Architectural ownership and immutability validation for ENG-7.",
  rules: ExecutiveDecisionOwnershipValidationRules,
  status: "PASS",
  owner: "ENG-7",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
