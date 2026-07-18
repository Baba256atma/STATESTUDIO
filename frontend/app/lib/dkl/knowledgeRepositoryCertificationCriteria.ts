/**
 * DKL-6:7 — Knowledge Repository Certification Criteria.
 *
 * Exactly seven ordered scope sections and eighteen certification criteria.
 * All criteria resolve to Pass against canonical Platform evidence.
 *
 * Ownership: owned exclusively by DKL-6:7.
 */

import {
  KnowledgeRepositoryFoundationId,
  KnowledgeRepositoryFoundationStatus,
  KnowledgeRepositoryFoundationVersion,
} from "./knowledgeRepositoryFoundation.ts";
import {
  KnowledgeRepositoryManifestId,
  KnowledgeRepositoryManifestStatus,
  KnowledgeRepositoryManifestVersion,
} from "./knowledgeRepositoryManifest.ts";
import {
  KnowledgeRepositoryModelId,
  KnowledgeRepositoryModelStatus,
  KnowledgeRepositoryModelVersion,
} from "./knowledgeRepositoryModel.ts";
import {
  getKnowledgeRepositoryPlatformPublicApiCount,
  getKnowledgeRepositoryPlatformSummary,
  KnowledgeRepositoryPlatform,
  KnowledgeRepositoryPlatformId,
  KnowledgeRepositoryPlatformStatus,
  KnowledgeRepositoryPlatformVersion,
} from "./knowledgeRepositoryPlatform.ts";
import {
  KnowledgeRepositoryRegistryId,
  KnowledgeRepositoryRegistryStatus,
  KnowledgeRepositoryRegistryVersion,
} from "./knowledgeRepositoryRegistry.ts";
import {
  KnowledgeRepositoryValidationId,
  KnowledgeRepositoryValidationStatus,
  KnowledgeRepositoryValidationVersion,
} from "./knowledgeRepositoryValidation.ts";
import type {
  KnowledgeRepositoryCertificationCriterion,
  KnowledgeRepositoryCertificationScope,
} from "./knowledgeRepositoryCertificationTypes.ts";

export const KnowledgeRepositoryCertificationScopeId =
  "DKL-6:7/KnowledgeRepositoryCertification" as const;
export const KnowledgeRepositoryCertificationScopeVersion = "1.0.0" as const;
export const KnowledgeRepositoryCertificationScopeStatus = "Certified" as const;

const platformSummary = getKnowledgeRepositoryPlatformSummary();

const scope = (
  id: string,
  name: KnowledgeRepositoryCertificationScope["name"],
  sourceIdentity: string,
  sourceVersion: string,
  sourceStatus: string,
  order: number,
): KnowledgeRepositoryCertificationScope =>
  Object.freeze({
    id,
    name,
    sourceIdentity,
    sourceVersion,
    sourceStatus,
    order,
    included: true as const,
    stable: true as const,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

const criterion = (
  id: string,
  name: string,
  category: string,
  description: string,
  subjectReference: string,
  expected: string,
  actual: string,
  status: "Pass" | "Fail",
  severity: "Critical" | "Required",
): KnowledgeRepositoryCertificationCriterion =>
  Object.freeze({
    id,
    name,
    category,
    description,
    subjectReference,
    expected,
    actual,
    status,
    severity,
    owner: "DKL-6" as const,
    runtimeBehavior: "None" as const,
  });

/** Exactly seven ordered certification scope sections. */
export const KnowledgeRepositoryCertificationScopeEntries: readonly KnowledgeRepositoryCertificationScope[] =
  Object.freeze([
    scope(
      "DKL-6:7/Scope/foundation",
      "foundation",
      KnowledgeRepositoryFoundationId,
      KnowledgeRepositoryFoundationVersion,
      KnowledgeRepositoryFoundationStatus,
      1,
    ),
    scope(
      "DKL-6:7/Scope/registry",
      "registry",
      KnowledgeRepositoryRegistryId,
      KnowledgeRepositoryRegistryVersion,
      KnowledgeRepositoryRegistryStatus,
      2,
    ),
    scope(
      "DKL-6:7/Scope/model",
      "model",
      KnowledgeRepositoryModelId,
      KnowledgeRepositoryModelVersion,
      KnowledgeRepositoryModelStatus,
      3,
    ),
    scope(
      "DKL-6:7/Scope/validation",
      "validation",
      KnowledgeRepositoryValidationId,
      KnowledgeRepositoryValidationVersion,
      KnowledgeRepositoryValidationStatus,
      4,
    ),
    scope(
      "DKL-6:7/Scope/manifest",
      "manifest",
      KnowledgeRepositoryManifestId,
      KnowledgeRepositoryManifestVersion,
      KnowledgeRepositoryManifestStatus,
      5,
    ),
    scope(
      "DKL-6:7/Scope/platform",
      "platform",
      KnowledgeRepositoryPlatformId,
      KnowledgeRepositoryPlatformVersion,
      KnowledgeRepositoryPlatformStatus,
      6,
    ),
    scope(
      "DKL-6:7/Scope/certification",
      "certification",
      KnowledgeRepositoryCertificationScopeId,
      KnowledgeRepositoryCertificationScopeVersion,
      KnowledgeRepositoryCertificationScopeStatus,
      7,
    ),
  ]);

const platformIdentityPass =
  KnowledgeRepositoryPlatformId === "DKL-6:6/KnowledgeRepositoryPlatform" &&
  KnowledgeRepositoryPlatform.identity.platformId === KnowledgeRepositoryPlatformId;

const orderedSectionsPass =
  KnowledgeRepositoryPlatform.sections.length === 6 &&
  KnowledgeRepositoryPlatform.sections.every(
    (section, index) => section.order === index + 1,
  );

const canonicalReferencesPass =
  KnowledgeRepositoryPlatform.foundation.foundationId ===
    KnowledgeRepositoryFoundationId &&
  KnowledgeRepositoryPlatform.registry.identity.registryId ===
    KnowledgeRepositoryRegistryId &&
  KnowledgeRepositoryPlatform.model.identity.modelId ===
    KnowledgeRepositoryModelId &&
  KnowledgeRepositoryPlatform.validation.identity.validationId ===
    KnowledgeRepositoryValidationId &&
  KnowledgeRepositoryPlatform.manifest.identity.manifestId ===
    KnowledgeRepositoryManifestId;

const foundationCompletenessPass =
  KnowledgeRepositoryPlatform.acceptances.inventory.foundationCapabilities === 9 &&
  KnowledgeRepositoryPlatform.acceptances.inventory.foundationContracts === 8 &&
  KnowledgeRepositoryPlatform.acceptances.inventory.foundationLifecycleStates ===
    7 &&
  KnowledgeRepositoryPlatform.acceptances.inventory.foundationPolicies === 6;

const registryCompletenessPass =
  KnowledgeRepositoryPlatform.acceptances.inventory.registryEntries === 103 &&
  KnowledgeRepositoryPlatform.acceptances.inventory.registryGroups === 16;

const modelCompletenessPass =
  KnowledgeRepositoryPlatform.acceptances.inventory.models === 52 &&
  KnowledgeRepositoryPlatform.acceptances.inventory.relationships === 13 &&
  KnowledgeRepositoryPlatform.acceptances.inventory
    .registryTraceabilityGroups === 14;

const validationCompletenessPass =
  KnowledgeRepositoryPlatform.acceptances.validation.rules === 40 &&
  KnowledgeRepositoryPlatform.acceptances.validation.passedRules === 40 &&
  KnowledgeRepositoryPlatform.acceptances.validation.failedRules === 0 &&
  KnowledgeRepositoryPlatform.acceptances.validation.gates === 10 &&
  KnowledgeRepositoryPlatform.acceptances.validation.passedGates === 10;

const manifestCompletenessPass =
  KnowledgeRepositoryPlatform.acceptances.manifest.manifestStatus ===
    "Manifested" &&
  KnowledgeRepositoryPlatform.acceptances.manifest.manifestCompleteness ===
    "Complete" &&
  KnowledgeRepositoryPlatform.acceptances.manifest.manifestBlockingIssueCount ===
    0;

const platformCompletenessPass =
  KnowledgeRepositoryPlatform.result.status === "PlatformComplete" &&
  KnowledgeRepositoryPlatform.result.completeness === "Complete" &&
  KnowledgeRepositoryPlatform.result.blockingIssueCount === 0 &&
  KnowledgeRepositoryPlatform.readinessGates.length === 14 &&
  KnowledgeRepositoryPlatform.readinessGates.every((gate) => gate.status === "Pass");

const ownershipIntegrityPass =
  KnowledgeRepositoryPlatform.manifest.ownership.ownedCount === 14 &&
  KnowledgeRepositoryPlatform.manifest.ownership.notOwnedCount === 18;

const boundaryIntegrityPass =
  KnowledgeRepositoryPlatform.boundaries.length === 18 &&
  KnowledgeRepositoryPlatform.boundaries.every(
    (boundary) => boundary.status === "Preserved",
  );

const dependencyIntegrityPass =
  KnowledgeRepositoryPlatform.dependencies.length === 15 &&
  KnowledgeRepositoryPlatform.dependencies.every(
    (dependency) =>
      dependency.dependencyType === "Architectural" &&
      dependency.compatibilityStatus === "Compatible",
  );

const traceabilityIntegrityPass =
  KnowledgeRepositoryPlatform.model.registryTraceability.length === 14 &&
  KnowledgeRepositoryPlatform.model.registryTraceability.every(
    (entry) => entry.modeled === true,
  );

const immutabilityPass =
  Object.isFrozen(KnowledgeRepositoryPlatform) &&
  Object.isFrozen(KnowledgeRepositoryPlatform.foundation) &&
  Object.isFrozen(KnowledgeRepositoryPlatform.registry) &&
  Object.isFrozen(KnowledgeRepositoryPlatform.model) &&
  Object.isFrozen(KnowledgeRepositoryPlatform.validation) &&
  Object.isFrozen(KnowledgeRepositoryPlatform.manifest);

const determinismPass =
  platformSummary.publicApiCount === getKnowledgeRepositoryPlatformPublicApiCount() &&
  platformSummary.publicApiCount === 46 &&
  platformSummary.deterministic === true;

const technologyNeutralityPass =
  KnowledgeRepositoryPlatform.runtimeProhibitions.technologyNeutral === true &&
  KnowledgeRepositoryPlatform.compatibility.some(
    (entry) => entry.name === "StorageTechnologyNeutral",
  );

const runtimeProhibitionPass =
  KnowledgeRepositoryPlatform.runtimeProhibitions.noPersistence === true &&
  KnowledgeRepositoryPlatform.runtimeProhibitions.noQueryExecution === true &&
  KnowledgeRepositoryPlatform.runtimeProhibitions.noRuntimeExecutor === true &&
  KnowledgeRepositoryPlatform.runtimeProhibitions.noAiBehavior === true &&
  KnowledgeRepositoryPlatform.runtimeProhibitions.noEngineReasoning === true &&
  KnowledgeRepositoryPlatform.runtimeProhibitions.noAdvisorOrSceneBehavior ===
    true &&
  KnowledgeRepositoryPlatform.runtimeProhibitions.noUiBehavior === true;

const freezeReadinessPass =
  KnowledgeRepositoryPlatform.result.readiness === "ReadyForDKL6Certification" &&
  platformCompletenessPass &&
  validationCompletenessPass &&
  manifestCompletenessPass &&
  runtimeProhibitionPass;

/** Exactly eighteen certification criteria — all Pass. */
export const KnowledgeRepositoryCertificationCriteria: readonly KnowledgeRepositoryCertificationCriterion[] =
  Object.freeze([
    criterion(
      "DKL-6:7/Criterion/CanonicalPlatformIdentityCriterion",
      "CanonicalPlatformIdentityCriterion",
      "IdentityAndComposition",
      "Platform identity equals DKL-6:6/KnowledgeRepositoryPlatform.",
      KnowledgeRepositoryPlatformId,
      "DKL-6:6/KnowledgeRepositoryPlatform",
      KnowledgeRepositoryPlatformId,
      platformIdentityPass ? "Pass" : "Fail",
      "Critical",
    ),
    criterion(
      "DKL-6:7/Criterion/OrderedPlatformSectionCriterion",
      "OrderedPlatformSectionCriterion",
      "IdentityAndComposition",
      "Platform declares six ordered sections.",
      KnowledgeRepositoryPlatformId,
      "sections=6;ordered",
      orderedSectionsPass ? "sections=6;ordered" : "section-order-fail",
      orderedSectionsPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/CanonicalPhaseReferenceCriterion",
      "CanonicalPhaseReferenceCriterion",
      "IdentityAndComposition",
      "Platform preserves canonical references to completed phases.",
      KnowledgeRepositoryPlatformId,
      "canonical-references-preserved",
      canonicalReferencesPass
        ? "canonical-references-preserved"
        : "reference-divergence",
      canonicalReferencesPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/FoundationCompletenessCriterion",
      "FoundationCompletenessCriterion",
      "Completeness",
      "Foundation capabilities, contracts, lifecycle, and policies are complete.",
      KnowledgeRepositoryFoundationId,
      "9/8/7/6",
      foundationCompletenessPass ? "9/8/7/6" : "foundation-incomplete",
      foundationCompletenessPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/RegistryCompletenessCriterion",
      "RegistryCompletenessCriterion",
      "Completeness",
      "Registry entries and groups are complete.",
      KnowledgeRepositoryRegistryId,
      "entries=103;groups=16",
      registryCompletenessPass
        ? "entries=103;groups=16"
        : "registry-incomplete",
      registryCompletenessPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/ModelCompletenessCriterion",
      "ModelCompletenessCriterion",
      "Completeness",
      "Model inventories and relationships are complete.",
      KnowledgeRepositoryModelId,
      "models=52;relationships=13;traceability=14",
      modelCompletenessPass
        ? "models=52;relationships=13;traceability=14"
        : "model-incomplete",
      modelCompletenessPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/ValidationCompletenessCriterion",
      "ValidationCompletenessCriterion",
      "Completeness",
      "Validation rules and gates are complete and passing.",
      KnowledgeRepositoryValidationId,
      "rules=40/40;gates=10/10",
      validationCompletenessPass
        ? "rules=40/40;gates=10/10"
        : "validation-incomplete",
      validationCompletenessPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/ManifestCompletenessCriterion",
      "ManifestCompletenessCriterion",
      "Completeness",
      "Manifest is Manifested and Complete with zero blocking issues.",
      KnowledgeRepositoryManifestId,
      "Manifested;Complete;blocking=0",
      manifestCompletenessPass
        ? "Manifested;Complete;blocking=0"
        : "manifest-incomplete",
      manifestCompletenessPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/PlatformCompletenessCriterion",
      "PlatformCompletenessCriterion",
      "Completeness",
      "Platform is PlatformComplete with fourteen passing readiness gates.",
      KnowledgeRepositoryPlatformId,
      "PlatformComplete;gates=14/14",
      platformCompletenessPass
        ? "PlatformComplete;gates=14/14"
        : "platform-incomplete",
      platformCompletenessPass ? "Pass" : "Fail",
      "Critical",
    ),
    criterion(
      "DKL-6:7/Criterion/OwnershipIntegrityCriterion",
      "OwnershipIntegrityCriterion",
      "Integrity",
      "Ownership and non-ownership declarations remain intact.",
      KnowledgeRepositoryManifestId,
      "owned=14;notOwned=18",
      ownershipIntegrityPass ? "owned=14;notOwned=18" : "ownership-fail",
      ownershipIntegrityPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/BoundaryIntegrityCriterion",
      "BoundaryIntegrityCriterion",
      "Integrity",
      "Eighteen platform boundaries remain Preserved.",
      KnowledgeRepositoryPlatformId,
      "boundaries=18;Preserved",
      boundaryIntegrityPass ? "boundaries=18;Preserved" : "boundary-fail",
      boundaryIntegrityPass ? "Pass" : "Fail",
      "Critical",
    ),
    criterion(
      "DKL-6:7/Criterion/DependencyIntegrityCriterion",
      "DependencyIntegrityCriterion",
      "Integrity",
      "Fifteen architectural Compatible dependencies remain intact.",
      KnowledgeRepositoryPlatformId,
      "dependencies=15;Architectural;Compatible",
      dependencyIntegrityPass
        ? "dependencies=15;Architectural;Compatible"
        : "dependency-fail",
      dependencyIntegrityPass ? "Pass" : "Fail",
      "Critical",
    ),
    criterion(
      "DKL-6:7/Criterion/TraceabilityIntegrityCriterion",
      "TraceabilityIntegrityCriterion",
      "Integrity",
      "Fourteen registry traceability groups remain modeled.",
      KnowledgeRepositoryModelId,
      "traceability=14;modeled",
      traceabilityIntegrityPass
        ? "traceability=14;modeled"
        : "traceability-fail",
      traceabilityIntegrityPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/ImmutabilityCriterion",
      "ImmutabilityCriterion",
      "Quality",
      "Platform and prior-phase aggregates remain frozen.",
      KnowledgeRepositoryPlatformId,
      "frozen",
      immutabilityPass ? "frozen" : "mutable",
      immutabilityPass ? "Pass" : "Fail",
      "Critical",
    ),
    criterion(
      "DKL-6:7/Criterion/DeterminismCriterion",
      "DeterminismCriterion",
      "Quality",
      "Platform summaries and public API counts are deterministic.",
      KnowledgeRepositoryPlatformId,
      "publicApis=46;deterministic",
      determinismPass ? "publicApis=46;deterministic" : "nondeterministic",
      determinismPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/TechnologyNeutralityCriterion",
      "TechnologyNeutralityCriterion",
      "Quality",
      "Platform remains storage-technology neutral.",
      KnowledgeRepositoryPlatformId,
      "technology-neutral",
      technologyNeutralityPass ? "technology-neutral" : "technology-coupled",
      technologyNeutralityPass ? "Pass" : "Fail",
      "Required",
    ),
    criterion(
      "DKL-6:7/Criterion/RuntimeProhibitionCriterion",
      "RuntimeProhibitionCriterion",
      "Quality",
      "No persistence, query, runtime, AI, Engine, Advisor, Scene, or UI behavior exists.",
      KnowledgeRepositoryPlatformId,
      "runtime-prohibited",
      runtimeProhibitionPass ? "runtime-prohibited" : "runtime-present",
      runtimeProhibitionPass ? "Pass" : "Fail",
      "Critical",
    ),
    criterion(
      "DKL-6:7/Criterion/FreezeReadinessCriterion",
      "FreezeReadinessCriterion",
      "Readiness",
      "Completed platform is ready for DKL-6:8 Freeze.",
      KnowledgeRepositoryPlatformId,
      "ReadyForDKL6Certification;complete",
      freezeReadinessPass
        ? "ReadyForDKL6Certification;complete"
        : "not-freeze-ready",
      freezeReadinessPass ? "Pass" : "Fail",
      "Critical",
    ),
  ]);
