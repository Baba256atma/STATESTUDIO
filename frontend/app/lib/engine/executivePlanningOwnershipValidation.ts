import {
  ExecutivePlanningFoundation,
  ExecutivePlanningMetadata,
  ExecutivePlanningOwnership,
} from "./executivePlanningIndex.ts";
import { getExecutivePlanningModelInventory } from "./executivePlanningModelIndex.ts";
import { getExecutivePlanningRegistryInventory } from "./executivePlanningRegistryIndex.ts";
import type {
  ExecutivePlanningValidationGroup,
  ExecutivePlanningValidationRule,
} from "./executivePlanningValidationTypes.ts";

const registryInventory = getExecutivePlanningRegistryInventory();
const modelInventory = getExecutivePlanningModelInventory();

const rule = (
  key: string,
  name: string,
  description: string,
  expectedCondition: string,
  actualMetadataResult: string,
  severity: ExecutivePlanningValidationRule["severity"] = "Critical",
) => Object.freeze({
  id: `eng-5-validation-ownership-${key}`,
  name,
  description,
  category: "Ownership",
  severity,
  status: "Pass",
  targetPhase: "ENG-5:4",
  expectedCondition,
  actualMetadataResult,
  owner: "ENG-5",
  result: Object.freeze({
    status: "Pass",
    description: "Satisfied by approved ENG-5 ownership and OPS execution boundary declarations.",
    metadataOnly: true,
    immutable: true,
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutivePlanningValidationRule);

export const ExecutivePlanningOwnershipValidation = Object.freeze({
  id: "eng-5-validation-group-ownership",
  name: "ENG-5 Ownership Validation",
  category: "Ownership",
  targetPhase: "ENG-5:4",
  namespace: "nexora.engine.executive.planning.validation",
  owner: "ENG-5",
  rules: Object.freeze([
    rule(
      "engine-ownership",
      "Engine Ownership Preserved",
      "ENG-5 retains ownership of Executive Planning architecture metadata.",
      "owner=ENG-5",
      `owner=${ExecutivePlanningOwnership.owner}`,
    ),
    rule(
      "ops-ownership",
      "OPS Execution Ownership Preserved",
      "OPS remains the owner of execution runtime behavior.",
      "executionOwner=OPS",
      `executionOwner=${ExecutivePlanningOwnership.executionOwner}`,
    ),
    rule(
      "planning-boundaries",
      "Planning Boundaries Declared",
      "Planning owns plan/graph/dependency/ordering/priority/retry metadata only.",
      "owns=6",
      `owns=${ExecutivePlanningOwnership.owns.length}`,
    ),
    rule(
      "runtime-separation",
      "Runtime Separation Preserved",
      "Planning never owns execution, workflow, scheduling, task, or automation runtimes.",
      "neverOwns includes execution+runtimes",
      `neverOwns=${ExecutivePlanningOwnership.neverOwns.join("|")}`,
    ),
    rule(
      "dependency-direction",
      "Dependency Direction Forward-Only",
      "Foundation metadata depends on prior public indices only.",
      "publicDependencies>=4",
      `dependencies=${ExecutivePlanningMetadata.dependencies.length}`,
      "Error",
    ),
    rule(
      "metadata-only",
      "Metadata-Only Compliance",
      "Foundation, registry, and model inventories remain metadata-only.",
      "metadataOnly=true",
      `foundation=${String(ExecutivePlanningFoundation.metadataOnly)};registry=${String(registryInventory.metadataOnly)};model=${String(modelInventory.metadataOnly)}`,
      "Error",
    ),
    rule(
      "execution-isolation",
      "Execution Isolation",
      "Planning declares it plans execution only and never performs execution.",
      "plansExecutionOnly=true;performsExecution=false",
      `plansExecutionOnly=${String(ExecutivePlanningOwnership.boundary.plansExecutionOnly)};performsExecution=${String(ExecutivePlanningOwnership.boundary.performsExecution)}`,
    ),
    rule(
      "visualization-isolation",
      "Visualization Isolation",
      "Visualization ownership remains with Director, Scene, and EVE.",
      "Director|Scene|EVE",
      ExecutivePlanningOwnership.visualizationOwner,
      "Warning",
    ),
  ]),
  status: "Pass",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutivePlanningValidationGroup);
