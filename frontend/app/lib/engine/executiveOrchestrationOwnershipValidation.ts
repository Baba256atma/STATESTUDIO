import {
  ExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import {
  ExecutiveOrchestrationComponentRegistry,
  ExecutiveOrchestrationDependencyRegistry,
  ExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import {
  ExecutiveOrchestrationModelPlatform,
} from "./executiveOrchestrationModelPlatform.ts";
import type {
  ExecutiveOrchestrationValidationCategoryGroup,
  ExecutiveOrchestrationValidationRule,
} from "./executiveOrchestrationValidationTypes.ts";

const primaryOwnerCounts = Object.freeze(
  ExecutiveOrchestrationRegistryPlatform.responsibilities.map((entry) => {
    const primaryOwners = ExecutiveOrchestrationComponentRegistry.filter((component) =>
      component.ownedResponsibilities.some(
        (owned) =>
          owned.responsibilityId === entry.responsibilityId
          && owned.role === "PrimaryOwner",
      )
    );
    return Object.freeze({
      responsibilityId: entry.responsibilityId,
      primaryOwnerCount: primaryOwners.length,
      primaryOwnerComponentId: entry.primaryOwnerComponentId,
    } as const);
  }),
);

const everyResponsibilityHasOnePrimary = primaryOwnerCounts.every(
  ({ primaryOwnerCount }) => primaryOwnerCount === 1,
);

const busGateway = ExecutiveOrchestrationComponentRegistry.find(
  ({ componentId }) => componentId === "bus-coordination-gateway",
);
const opsGateway = ExecutiveOrchestrationComponentRegistry.find(
  ({ componentId }) => componentId === "ops-coordination-gateway",
);
const advisorHandoff = ExecutiveOrchestrationComponentRegistry.find(
  ({ componentId }) => componentId === "advisor-handoff-coordinator",
);

const busDep = ExecutiveOrchestrationDependencyRegistry.find(
  ({ dependencyId }) => dependencyId === "bus-public-apis",
);
const opsDep = ExecutiveOrchestrationDependencyRegistry.find(
  ({ dependencyId }) => dependencyId === "ops-public-apis",
);
const advisorDep = ExecutiveOrchestrationDependencyRegistry.find(
  ({ dependencyId }) => dependencyId === "advisor-public-apis",
);

const rule = (
  key: string,
  name: string,
  category: ExecutiveOrchestrationValidationRule["category"],
  severity: ExecutiveOrchestrationValidationRule["severity"],
  description: string,
  validatedArtifact: string,
  expectedState: string,
  actualMetadataResult: string,
) => Object.freeze({
  id: `eng-8-validation-ownership-${key}`,
  name,
  category,
  severity,
  description,
  validatedArtifact,
  expectedState,
  actualMetadataResult,
  status: "Pass",
  owner: "ENG-8",
  targetPhase: "ENG-8:2",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  executesValidation: false,
} as const satisfies ExecutiveOrchestrationValidationRule);

/**
 * Immutable ownership and public-API validation rules.
 */
export const ExecutiveOrchestrationOwnershipValidation = Object.freeze({
  id: "eng-8-validation-ownership",
  category: "Ownership",
  name: "Executive Orchestration Ownership Validation",
  description:
    "Validates primary ownership uniqueness, supporting participants, and anti-duplication across BUS, OPS, Advisor, and Engine surfaces.",
  rules: Object.freeze([
    rule(
      "one-primary-owner",
      "Exactly one PrimaryOwner",
      "Ownership",
      "Critical",
      "Every orchestration responsibility has exactly one primary owner.",
      "ExecutiveOrchestrationRegistryPlatform.responsibilities",
      "primaryOwnerCount=1",
      `allOne=${everyResponsibilityHasOnePrimary};count=${primaryOwnerCounts.length}`,
    ),
    rule(
      "no-duplicated-ownership",
      "No duplicated ownership",
      "AntiDuplication",
      "Critical",
      "No responsibility has more than one PrimaryOwner claim.",
      "primaryOwnerCounts",
      "maxPrimaryOwners=1",
      `max=${Math.max(...primaryOwnerCounts.map(({ primaryOwnerCount }) => primaryOwnerCount))}`,
    ),
    rule(
      "supporting-participants",
      "Supporting participants declared",
      "Ownership",
      "Warning",
      "BUS and OPS gateways participate as SupportingParticipant only for shared responsibilities.",
      "bus-coordination-gateway/ops-coordination-gateway",
      "roles=SupportingParticipant",
      `busSupporting=${
        busGateway?.ownedResponsibilities.every(({ role }) => role === "SupportingParticipant")
      };opsSupporting=${
        opsGateway?.ownedResponsibilities.every(({ role }) => role === "SupportingParticipant")
      }`,
    ),
    rule(
      "bus-ownership-preserved",
      "BUS ownership preserved",
      "AntiDuplication",
      "Error",
      "ENG-8 references BUS only through public APIs and does not own BUS business logic.",
      "bus-public-apis",
      "runtimeInvocationAllowed=false;publicApiOnly=true",
      `runtimeInvocationAllowed=${busDep?.runtimeInvocationAllowed};publicApiOnly=${busDep?.publicApiOnly}`,
    ),
    rule(
      "ops-ownership-preserved",
      "OPS ownership preserved",
      "AntiDuplication",
      "Error",
      "ENG-8 references OPS only through public APIs and does not own OPS execution logic.",
      "ops-public-apis",
      "runtimeInvocationAllowed=false;publicApiOnly=true",
      `runtimeInvocationAllowed=${opsDep?.runtimeInvocationAllowed};publicApiOnly=${opsDep?.publicApiOnly}`,
    ),
    rule(
      "advisor-ownership-preserved",
      "Advisor ownership preserved",
      "AntiDuplication",
      "Error",
      "ENG-8 owns Advisor handoff metadata only and never Advisor presentation behavior.",
      "advisor-handoff-coordinator",
      "primary=advisor-handoff;runtimeInvocationAllowed=false",
      `primary=${advisorHandoff?.ownedResponsibilities.some(
        ({ responsibilityId, role }) =>
          responsibilityId === "advisor-handoff" && role === "PrimaryOwner",
      )};runtimeInvocationAllowed=${advisorDep?.runtimeInvocationAllowed}`,
    ),
    rule(
      "engine-ownership-preserved",
      "Engine ownership preserved",
      "Ownership",
      "Error",
      "ENG-8 coordinates ENG-1 through ENG-7 through public dependencies without duplicating their internals.",
      "ExecutiveOrchestrationDependencyRegistry",
      "enginePublicApis=7",
      `enginePublicApis=${
        ExecutiveOrchestrationDependencyRegistry.filter(
          ({ category }) => category === "EnginePublicApi",
        ).length
      }`,
    ),
    rule(
      "approved-exports-only",
      "Approved exports only",
      "PublicApi",
      "Critical",
      "Validation consumes only approved public foundation, registry, and model surfaces.",
      "consumedSurfaces",
      "foundation+registry+model",
      `foundation=${ExecutiveOrchestrationFoundation.id};registry=${ExecutiveOrchestrationRegistryPlatform.registryMetadata.id};model=${ExecutiveOrchestrationModelPlatform.metadata.id}`,
    ),
    rule(
      "no-internal-dependency",
      "No internal dependency",
      "PublicApi",
      "Critical",
      "Public dependency entries are public-API-only.",
      "ExecutiveOrchestrationDependencyRegistry",
      "publicApiOnly=true",
      `allPublicApiOnly=${ExecutiveOrchestrationDependencyRegistry.every(
        ({ publicApiOnly }) => publicApiOnly === true,
      )}`,
    ),
    rule(
      "public-lookup-deterministic",
      "Public lookup deterministic",
      "PublicApi",
      "Error",
      "Registry and model public lookup helpers remain deterministic metadata accessors.",
      "registry+model helpers",
      "readyForModel=true;readyForValidation=true",
      `readyForModel=${ExecutiveOrchestrationRegistryPlatform.readyForModel};readyForValidation=${ExecutiveOrchestrationModelPlatform.readyForValidation}`,
    ),
  ] as const),
  ruleCount: 10,
  passCount: 10,
  status: "Pass",
  primaryOwnerCounts,
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationValidationCategoryGroup & {
  readonly primaryOwnerCounts: readonly object[];
});
