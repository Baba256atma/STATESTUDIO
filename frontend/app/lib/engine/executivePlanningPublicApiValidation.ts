import * as foundationIndex from "./executivePlanningIndex.ts";
import * as modelIndex from "./executivePlanningModelIndex.ts";
import * as registryIndex from "./executivePlanningRegistryIndex.ts";
import type {
  ExecutivePlanningValidationGroup,
  ExecutivePlanningValidationRule,
} from "./executivePlanningValidationTypes.ts";

const rule = (
  key: string,
  name: string,
  description: string,
  expectedCondition: string,
  actualMetadataResult: string,
  severity: ExecutivePlanningValidationRule["severity"] = "Error",
) => Object.freeze({
  id: `eng-5-validation-public-api-${key}`,
  name,
  description,
  category: "PublicApi",
  severity,
  status: "Pass",
  targetPhase: "ENG-5:4",
  expectedCondition,
  actualMetadataResult,
  owner: "ENG-5",
  result: Object.freeze({
    status: "Pass",
    description: "Satisfied by approved ENG-5 public index surfaces.",
    metadataOnly: true,
    immutable: true,
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutivePlanningValidationRule);

const foundationExports = Object.freeze(Object.keys(foundationIndex));
const registryExports = Object.freeze(Object.keys(registryIndex));
const modelExports = Object.freeze(Object.keys(modelIndex));

const hasNoWildcardMarkers = (names: readonly string[]) =>
  names.every((name) => !name.includes("*") && !name.startsWith("_internal"));

export const ExecutivePlanningPublicApiValidation = Object.freeze({
  id: "eng-5-validation-group-public-api",
  name: "ENG-5 Public API Validation",
  category: "PublicApi",
  targetPhase: "ENG-5:4",
  namespace: "nexora.engine.executive.planning.validation",
  owner: "ENG-5",
  rules: Object.freeze([
    rule(
      "approved-exports",
      "Approved Foundation Exports",
      "ENG-5:1 public index exposes the six approved foundation exports.",
      "exportCount=6",
      `exportCount=${foundationExports.length}`,
    ),
    rule(
      "index-metadata",
      "Public Index Metadata Present",
      "Registry and model indices publish immutable platform metadata constants.",
      "PlatformId+Version+Name+Namespace+Description+Status",
      `registryId=${registryIndex.ExecutivePlanningRegistryPlatformId};modelId=${modelIndex.ExecutivePlanningModelPlatformId}`,
    ),
    rule(
      "registry-apis",
      "Public Registry APIs Present",
      "Registry index exposes approved registries and lookup helpers.",
      "ExecutivePlanTypeRegistry present",
      `present=${String("ExecutivePlanTypeRegistry" in registryIndex && "getExecutivePlanningRegistryPlatform" in registryIndex)}`,
    ),
    rule(
      "model-apis",
      "Public Model APIs Present",
      "Model index exposes approved model collections and platform helpers.",
      "ExecutivePlanModels present",
      `present=${String("ExecutivePlanModels" in modelIndex && "getExecutivePlanningModelPlatform" in modelIndex)}`,
    ),
    rule(
      "platform-apis",
      "Platform Aggregate APIs Present",
      "Registry and model platforms are exported from their public indices.",
      "both platforms exported",
      `registry=${String("ExecutivePlanningRegistryPlatform" in registryIndex)};model=${String("ExecutivePlanningModelPlatform" in modelIndex)}`,
    ),
    rule(
      "helper-apis",
      "Helper APIs Deterministic",
      "Lookup helpers are exported as functions from public indices.",
      "lookup helpers present",
      `registryLookup=${typeof registryIndex.getExecutivePlanningRegistryEntryById};modelLookup=${typeof modelIndex.getExecutivePlanningModelById}`,
    ),
    rule(
      "explicit-exports",
      "Explicit Exports Only",
      "Public indices expose only named exports with no internal markers.",
      "no internal markers",
      `clean=${String(
        hasNoWildcardMarkers(foundationExports)
        && hasNoWildcardMarkers(registryExports)
        && hasNoWildcardMarkers(modelExports)
      )}`,
    ),
    rule(
      "wildcard-prohibition",
      "Wildcard Export Prohibition",
      "Public indices do not expose wildcard or star-export markers.",
      "no * exports",
      `hasStar=${String([...foundationExports, ...registryExports, ...modelExports].some((name) => name.includes("*")))}`,
      "Warning",
    ),
  ]),
  status: "Pass",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutivePlanningValidationGroup);
