/**
 * DKL-3:4 — Data Understanding Validation.
 *
 * Canonical immutable validation layer for the Data Understanding Platform.
 * Publishes exactly eight runtime APIs. Validates structural compliance of
 * DKL-3:3 models against DKL-3:1 Foundation and DKL-3:2 Registry contracts.
 *
 * Never understands. Never repairs. Never mutates. Never throws for ordinary
 * invalid input. Never creates Business Objects, Knowledge Graphs, or candidates.
 *
 * Ownership: owned exclusively by DKL-3:4.
 */

import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import { PipelineUnderstandingPlatform } from "../pipeline/pipelineUnderstandingPlatform.ts";
import {
  DataUnderstandingContracts,
  DataUnderstandingEvidenceCatalog,
  DataUnderstandingFoundation,
  DataUnderstandingLifecycle,
} from "./dataUnderstandingFoundation.ts";
import {
  DataUnderstandingCandidateRegistry,
  DataUnderstandingEvidenceRegistry,
  DataUnderstandingRegistry,
  DataUnderstandingSubjectRegistry,
} from "./dataUnderstandingRegistry.ts";
import {
  DataUnderstandingModel,
} from "./dataUnderstandingModel.ts";
import { DataUnderstandingValidationBoundaries } from "./dataUnderstandingValidationBoundaries.ts";
import { DataUnderstandingValidationOwnership } from "./dataUnderstandingValidationOwnership.ts";
import { DataUnderstandingValidationRules } from "./dataUnderstandingValidationRules.ts";
import { DataUnderstandingValidationReport } from "./dataUnderstandingValidationReport.ts";
import {
  DATA_UNDERSTANDING_VALIDATION_IDENTITY,
  DATA_UNDERSTANDING_VALIDATION_PUBLIC_API_NAMES,
  DATA_UNDERSTANDING_VALIDATION_VERSION,
  DataUnderstandingValidationManifest,
} from "./dataUnderstandingValidationManifest.ts";
import type {
  DataUnderstandingModelValidationView,
  DataUnderstandingValidationIssue,
  DataUnderstandingValidationMetadata,
  DataUnderstandingValidationResult,
  DataUnderstandingValidationRuleResult,
} from "./dataUnderstandingValidationTypes.ts";

export const DataUnderstandingValidationVersion: string =
  DATA_UNDERSTANDING_VALIDATION_VERSION;

const METADATA: DataUnderstandingValidationMetadata = Object.freeze({
  metadataOnly: true,
  validationOnly: true,
  deterministic: true,
  immutable: true,
  semanticInferencePerformed: false,
  understandingPerformed: false,
  candidateGenerationPerformed: false,
  businessObjectsCreated: false,
  knowledgeGraphCreated: false,
  persistencePerformed: false,
  aiExecuted: false,
  engineReasoningPerformed: false,
  inputMutated: false,
  modelsRepaired: false,
});

const deepFreeze = <T>(value: T): T => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    deepFreeze(nested);
  }
  return Object.freeze(value);
};

const sameMembers = (
  actual: readonly string[] | undefined,
  expected: readonly string[],
): boolean => {
  if (!actual || actual.length !== expected.length) {
    return false;
  }
  for (let i = 0; i < expected.length; i += 1) {
    if (actual[i] !== expected[i]) {
      return false;
    }
  }
  return true;
};

const includesAll = (
  actual: readonly string[] | undefined,
  required: readonly string[],
): boolean => {
  if (!actual) {
    return false;
  }
  return required.every((item) => actual.includes(item));
};

const pass = (
  ruleId: string,
  category: DataUnderstandingValidationRuleResult["category"],
  message: string,
  evidence: string,
  blocking: boolean,
): DataUnderstandingValidationRuleResult =>
  Object.freeze({
    ruleId,
    category,
    status: "PASS",
    severity: "Info",
    message,
    evidence,
    blocking,
  });

const fail = (
  ruleId: string,
  category: DataUnderstandingValidationRuleResult["category"],
  message: string,
  evidence: string,
  blocking: boolean,
): DataUnderstandingValidationRuleResult =>
  Object.freeze({
    ruleId,
    category,
    status: "FAIL",
    severity: blocking ? "Blocking" : "Error",
    message,
    evidence,
    blocking,
  });

const toIssue = (
  result: DataUnderstandingValidationRuleResult,
): DataUnderstandingValidationIssue =>
  Object.freeze({
    code: result.ruleId,
    category: result.category,
    severity: result.severity,
    message: result.message,
    field: result.ruleId,
    evidence: result.evidence,
    blocking: result.blocking,
  });

const REQUIRED_MODEL_KINDS = Object.freeze([
  "UnderstandingSubject",
  "UnderstandingCandidate",
  "UnderstandingEvidence",
  "UnderstandingRelationship",
  "UnderstandingSnapshot",
  "UnderstandingContext",
  "UnderstandingAmbiguity",
  "UnderstandingClarification",
  "UnderstandingConfidence",
  "UnderstandingScope",
  "UnderstandingLifecycle",
  "UnderstandingProcessingPolicy",
  "UnderstandingResult",
  "ValidationSummaryReference",
  "PipelineReference",
  "RegistryReference",
  "FoundationReference",
]);

const REQUIRED_RELATIONSHIP_KINDS = Object.freeze([
  "supports",
  "suggests",
  "belongsToSubject",
  "derivedFrom",
  "references",
  "requiresClarification",
]);

/**
 * Validate a Data Understanding model view against Foundation, Registry, and
 * Model contracts. Returns an immutable validation summary. Never throws for
 * ordinary invalid input. Never mutates input. Never repairs or generates models.
 */
export function validateDataUnderstandingModel(
  input: DataUnderstandingModelValidationView | null | undefined,
): DataUnderstandingValidationResult {
  try {
    const ruleResults: DataUnderstandingValidationRuleResult[] = [];

    if (input === null || input === undefined || typeof input !== "object") {
      ruleResults.push(
        fail("ModelPresent", "Model", "A Data Understanding model view must be supplied.", "input missing", true),
      );
      return finalize(ruleResults);
    }

    // ModelPresent
    ruleResults.push(
      pass("ModelPresent", "Model", "Model view is present.", "input object supplied", true),
    );

    // Foundation
    const foundationOk =
      input.foundationReference?.sourcePhase === "DKL-3:1" &&
      input.foundationReference.foundationId ===
        DataUnderstandingFoundation.identity.foundationId;
    ruleResults.push(
      foundationOk
        ? pass(
            "FoundationIdentityAligned",
            "Foundation",
            "Foundation reference aligns with DKL-3:1.",
            input.foundationReference?.foundationId ?? "",
            true,
          )
        : fail(
            "FoundationIdentityAligned",
            "Foundation",
            "Foundation reference does not align with DKL-3:1.",
            String(input.foundationReference?.foundationId),
            true,
          ),
    );

    const foundationReady =
      input.foundationReference?.readiness === "ReadyForRegistry" &&
      DataUnderstandingFoundation.readiness.ReadyForRegistry === true;
    ruleResults.push(
      foundationReady
        ? pass(
            "FoundationReadyForRegistry",
            "Foundation",
            "Foundation is ReadyForRegistry.",
            "ReadyForRegistry",
            true,
          )
        : fail(
            "FoundationReadyForRegistry",
            "Foundation",
            "Foundation is not ReadyForRegistry.",
            String(input.foundationReference?.readiness),
            true,
          ),
    );

    // Registry
    const registryOk =
      input.registryReference?.sourcePhase === "DKL-3:2" &&
      input.registryReference.registryId ===
        DataUnderstandingRegistry.identity.registryId;
    ruleResults.push(
      registryOk
        ? pass(
            "RegistryIdentityAligned",
            "Registry",
            "Registry reference aligns with DKL-3:2.",
            input.registryReference?.registryId ?? "",
            true,
          )
        : fail(
            "RegistryIdentityAligned",
            "Registry",
            "Registry reference does not align with DKL-3:2.",
            String(input.registryReference?.registryId),
            true,
          ),
    );

    const registryReady =
      input.registryReference?.readiness === "ReadyForModel" &&
      DataUnderstandingRegistry.readiness.ReadyForModel === true;
    ruleResults.push(
      registryReady
        ? pass(
            "RegistryReadyForModel",
            "Registry",
            "Registry is ReadyForModel.",
            "ReadyForModel",
            true,
          )
        : fail(
            "RegistryReadyForModel",
            "Registry",
            "Registry is not ReadyForModel.",
            String(input.registryReference?.readiness),
            true,
          ),
    );

    // Model identity
    const modelIdentityOk =
      input.identity?.sourcePhase === "DKL-3:3" &&
      input.identity.status === "ModelComplete" &&
      input.identity.readiness === "ReadyForValidation" &&
      input.identity.modelId === DataUnderstandingModel.identity.modelId;
    ruleResults.push(
      modelIdentityOk
        ? pass(
            "ModelIdentityStable",
            "Model",
            "Model identity is stable and ReadyForValidation.",
            input.identity?.modelId ?? "",
            true,
          )
        : fail(
            "ModelIdentityStable",
            "Model",
            "Model identity is not stable or not ReadyForValidation.",
            JSON.stringify(input.identity ?? null),
            true,
          ),
    );

    const kindsOk =
      includesAll(input.modelKinds, REQUIRED_MODEL_KINDS) &&
      (input.modelKindCount ?? 0) === REQUIRED_MODEL_KINDS.length;
    ruleResults.push(
      kindsOk
        ? pass("ModelKindsComplete", "Model", "All required model kinds are present.", `count=${REQUIRED_MODEL_KINDS.length}`, true)
        : fail("ModelKindsComplete", "Model", "Required model kinds are incomplete.", `count=${input.modelKindCount ?? 0}`, true),
    );

    // Subject
    const subjectsOk =
      sameMembers(input.subject?.allowedSubjectKinds, DataUnderstandingContracts.subjectKinds) &&
      input.subject?.registrySubjectCount === DataUnderstandingSubjectRegistry.entryCount;
    ruleResults.push(
      subjectsOk
        ? pass("SubjectKindsRegistered", "Subject", "Subject kinds match foundation and registry.", "7 subjects", true)
        : fail("SubjectKindsRegistered", "Subject", "Subject kinds do not match foundation/registry.", "mismatch", true),
    );

    // Candidate
    const candidateTypesOk = sameMembers(
      input.candidate?.allowedCandidateTypes,
      DataUnderstandingContracts.candidateTypes,
    );
    ruleResults.push(
      candidateTypesOk &&
        input.candidate?.registry?.candidateTypeCount ===
          DataUnderstandingCandidateRegistry.candidateTypeCount
        ? pass("CandidateTypesRegistered", "Candidate", "Candidate types are registered.", `${DataUnderstandingContracts.candidateTypes.length} types`, true)
        : fail("CandidateTypesRegistered", "Candidate", "Candidate types are not registered correctly.", "mismatch", true),
    );

    const candidateStatusesOk = sameMembers(
      input.candidate?.allowedCandidateStatuses,
      DataUnderstandingContracts.candidateStatuses,
    );
    ruleResults.push(
      candidateStatusesOk
        ? pass("CandidateStatusesRegistered", "Candidate", "Candidate statuses are registered.", "5 statuses", true)
        : fail("CandidateStatusesRegistered", "Candidate", "Candidate statuses are not registered correctly.", "mismatch", true),
    );

    const candidatesNotBo =
      input.candidate?.forbiddenContents?.includes("BusinessObject") === true &&
      input.candidate?.boundaries?.businessObjectForbidden === true &&
      input.candidate?.registry?.candidatesAreNotBusinessObjects === true;
    ruleResults.push(
      candidatesNotBo
        ? pass("CandidatesNotBusinessObjects", "Candidate", "Candidates forbid Business Objects.", "forbiddenContents includes BusinessObject", true)
        : fail("CandidatesNotBusinessObjects", "Candidate", "Candidates do not forbid Business Objects.", "boundary violation", true),
    );

    // Evidence
    const evidenceCatsOk = sameMembers(
      input.evidence?.allowedCategories,
      DataUnderstandingEvidenceCatalog.categories,
    );
    ruleResults.push(
      evidenceCatsOk &&
        input.evidence?.registry?.evidenceCategoryCount ===
          DataUnderstandingEvidenceRegistry.entryCount
        ? pass("EvidenceCategoriesRegistered", "Evidence", "Evidence categories are registered.", "15 categories", true)
        : fail("EvidenceCategoriesRegistered", "Evidence", "Evidence categories are not registered correctly.", "mismatch", true),
    );

    ruleResults.push(
      input.evidence?.limitationsRequired === true &&
        input.evidence?.runtimeCalculationForbidden === true
        ? pass("EvidenceLimitationsRequired", "Evidence", "Evidence limitations are required; calculation forbidden.", "limitationsRequired=true", true)
        : fail("EvidenceLimitationsRequired", "Evidence", "Evidence limitations/calculation rules are invalid.", "policy violation", true),
    );

    // Relationship
    const relationshipsOk =
      sameMembers(input.relationship?.relationshipKinds, REQUIRED_RELATIONSHIP_KINDS) &&
      input.relationship?.relationshipKindCount === 6 &&
      input.relationship?.forbiddenMeanings?.includes("KnowledgeGraphEdges") === true;
    ruleResults.push(
      relationshipsOk
        ? pass("RelationshipKindsRegistered", "Relationship", "Relationship kinds are provisional and registered.", "6 kinds", true)
        : fail("RelationshipKindsRegistered", "Relationship", "Relationship kinds are invalid.", "mismatch", true),
    );

    // Clarification
    ruleResults.push(
      sameMembers(
        input.clarification?.allowedStatuses,
        DataUnderstandingContracts.clarificationStatuses,
      ) && input.clarification?.clarificationEngineForbidden === true
        ? pass("ClarificationStatusesRegistered", "Clarification", "Clarification statuses are registered.", "4 statuses", true)
        : fail("ClarificationStatusesRegistered", "Clarification", "Clarification statuses are invalid.", "mismatch", true),
    );

    // Confidence
    ruleResults.push(
      sameMembers(
        input.confidence?.allowedConfidenceLevels,
        DataUnderstandingContracts.confidenceLevels,
      ) &&
        input.confidence?.floatingPointForbidden === true &&
        input.confidence?.guaranteedTruthForbidden === true
        ? pass("ConfidenceLevelsRegistered", "Confidence", "Confidence levels are registered without floats or guaranteed truth.", "5 levels", true)
        : fail("ConfidenceLevelsRegistered", "Confidence", "Confidence levels are invalid.", "mismatch", true),
    );

    // Ambiguity
    ruleResults.push(
      sameMembers(
        input.ambiguity?.allowedAmbiguityLevels,
        DataUnderstandingContracts.ambiguityLevels,
      )
        ? pass("AmbiguityLevelsRegistered", "Ambiguity", "Ambiguity levels are registered.", "5 levels", true)
        : fail("AmbiguityLevelsRegistered", "Ambiguity", "Ambiguity levels are invalid.", "mismatch", true),
    );

    // Snapshot
    const snapshotOk =
      (input.snapshot?.snapshotSectionCount ?? 0) >= 16 &&
      (input.snapshot?.resultFieldCount ?? 0) >= 12 &&
      sameMembers(input.snapshot?.allowedScopes, DataUnderstandingContracts.understandingScopes) &&
      sameMembers(
        input.snapshot?.allowedResultStatuses,
        DataUnderstandingContracts.resultStatuses,
      ) &&
      input.snapshot?.forbiddenOutputs?.includes("BusinessObjects") === true &&
      input.snapshot?.forbiddenOutputs?.includes("KnowledgeGraph") === true;
    ruleResults.push(
      snapshotOk
        ? pass("SnapshotIntegrity", "Snapshot", "Snapshot integrity is intact.", `sections=${input.snapshot?.snapshotSectionCount}`, true)
        : fail("SnapshotIntegrity", "Snapshot", "Snapshot integrity failed.", "section/output mismatch", true),
    );

    // Result
    ruleResults.push(
      input.result?.readiness === "ReadyForValidation" &&
        sameMembers(input.result?.allowedStatuses, DataUnderstandingContracts.resultStatuses)
        ? pass("ResultIntegrity", "Result", "Result integrity is ReadyForValidation-aligned.", "ReadyForValidation", true)
        : fail("ResultIntegrity", "Result", "Result integrity failed.", String(input.result?.readiness), true),
    );

    // Pipeline reference
    ruleResults.push(
      input.pipelineReference?.targetPlatform === "DKL-3" &&
        input.pipelineReference?.readiness === "ReadyForDKL3Intake" &&
        input.pipelineReference?.previewOnlyRequired === true &&
        input.pipelineReference?.contractValidRequired === true &&
        PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake === true
        ? pass("PipelineReferenceValid", "Reference", "Pipeline reference is valid.", "ReadyForDKL3Intake", true)
        : fail("PipelineReferenceValid", "Reference", "Pipeline reference is invalid.", JSON.stringify(input.pipelineReference ?? null), true),
    );

    // Validation summary reference
    ruleResults.push(
      input.validationSummaryReference?.validationPhase === "DKL-3:4" &&
        input.validationSummaryReference?.readyForBusinessObjects === false
        ? pass(
            "ValidationSummaryReferencePending",
            "Reference",
            "Validation summary reference defers Business Objects.",
            "readyForBusinessObjects=false",
            true,
          )
        : fail(
            "ValidationSummaryReferencePending",
            "Reference",
            "Validation summary reference is invalid.",
            JSON.stringify(input.validationSummaryReference ?? null),
            true,
          ),
    );

    // Ownership
    const owns = input.ownership?.owns ?? [];
    const doesNotOwn = input.ownership?.doesNotOwn ?? [];
    const overlap = owns.some((item) =>
      doesNotOwn.map((s) => s.toLowerCase()).includes(item.toLowerCase()),
    );
    ruleResults.push(
      owns.length >= 11 && doesNotOwn.length >= 15 && !overlap
        ? pass("OwnershipCompliant", "Ownership", "Ownership declarations are complete and non-overlapping.", `owns=${owns.length}`, true)
        : fail("OwnershipCompliant", "Ownership", "Ownership declarations are incomplete or overlapping.", "ownership violation", true),
    );

    // Boundaries
    const boundariesOk =
      input.boundaries?.createsBusinessObjects === false &&
      input.boundaries?.createsKnowledgeGraph === false &&
      input.boundaries?.persistsDataset === false &&
      input.boundaries?.executesAiModels === false &&
      input.boundaries?.executesEngineReasoning === false &&
      input.boundaries?.rendersUi === false &&
      input.readiness?.BusinessObjectCreationForbidden === true &&
      input.readiness?.KnowledgeGraphForbidden === true &&
      input.readiness?.PersistenceForbidden === true &&
      input.readiness?.AIFree === true &&
      input.readiness?.EngineFree === true;
    ruleResults.push(
      boundariesOk
        ? pass("BoundaryCompliant", "Boundary", "Boundaries forbid BO, KG, persistence, AI, Engine, and UI.", "all false", true)
        : fail("BoundaryCompliant", "Boundary", "Boundary compliance failed.", "boundary violation", true),
    );

    // Lifecycle
    ruleResults.push(
      sameMembers(input.lifecycle?.allowedStates, DataUnderstandingLifecycle.states) &&
        input.lifecycle?.stateCount === DataUnderstandingLifecycle.stateCount
        ? pass("LifecycleStatesValid", "Lifecycle", "Lifecycle states match foundation.", "11 states", true)
        : fail("LifecycleStatesValid", "Lifecycle", "Lifecycle states are invalid.", "mismatch", true),
    );

    // Processing policy
    const policies = input.processingPolicy?.policies;
    const policyOk =
      policies?.previewOnlyInputRequired === true &&
      policies?.allowCanonicalBusinessObjects === false &&
      policies?.allowPersistence === false &&
      policies?.allowAiProviderCalls === false &&
      policies?.allowExecutiveReasoning === false &&
      policies?.requireEvidenceForCandidates === true &&
      policies?.requireLimitationsForEvidence === true &&
      policies?.preserveAmbiguity === true;
    ruleResults.push(
      policyOk
        ? pass("ProcessingPolicyValid", "ProcessingPolicy", "Processing policies are valid.", "preview-only + forbidden processing", true)
        : fail("ProcessingPolicyValid", "ProcessingPolicy", "Processing policies are invalid.", "policy violation", true),
    );

    // Dependencies
    const depsOk =
      input.dependencies?.dkl31Foundation?.readyForRegistry === true &&
      input.dependencies?.dkl32Registry?.readyForModel === true &&
      input.dependencies?.pipelineUnderstandingPlatform?.readyForDKL3Intake === true;
    ruleResults.push(
      depsOk
        ? pass("DependencyCompliant", "Dependency", "Dependencies report ready.", "foundation+registry+pipeline", true)
        : fail("DependencyCompliant", "Dependency", "Dependencies are not ready.", "dependency failure", true),
    );

    // Public API
    const publicApiOk =
      sameMembers(input.publicApiNames, DataUnderstandingModel.publicApiNames) &&
      (input.publicApiNames?.length ?? 0) === 8;
    ruleResults.push(
      publicApiOk
        ? pass("PublicApiConsistent", "PublicApi", "Model public API names are consistent.", "8 exports", true)
        : fail("PublicApiConsistent", "PublicApi", "Model public API names are inconsistent.", `count=${input.publicApiNames?.length ?? 0}`, true),
    );

    // Identity uniqueness
    const identities = Object.freeze([
      input.identity?.modelId,
      input.foundationReference?.foundationId,
      input.registryReference?.registryId,
    ]);
    const identityUnique =
      identities.every((id) => typeof id === "string" && id.length > 0) &&
      new Set(identities).size === 3;
    ruleResults.push(
      identityUnique
        ? pass("IdentityUniqueness", "Identity", "Model, foundation, and registry identities are unique.", identities.join(" | "), true)
        : fail("IdentityUniqueness", "Identity", "Identities are missing or not unique.", identities.join(" | "), true),
    );

    void DataSourceKnowledgeRegistryPublicIndexVersion;
    void DataUnderstandingValidationRules;

    return finalize(ruleResults);
  } catch {
    return finalize([
      fail(
        "ModelPresent",
        "Model",
        "Validation failed without throwing to the caller.",
        "unexpected failure",
        true,
      ),
    ]);
  }
}

function finalize(
  ruleResults: readonly DataUnderstandingValidationRuleResult[],
): DataUnderstandingValidationResult {
  const frozenRules = Object.freeze([...ruleResults]);
  const fails = frozenRules.filter((r) => r.status === "FAIL");
  const warnings = frozenRules.filter((r) => r.status === "WARNING");
  const passes = frozenRules.filter((r) => r.status === "PASS");
  const blockingFails = fails.filter((r) => r.blocking);
  const issues = Object.freeze(fails.map(toIssue));
  const warningIssues = Object.freeze(warnings.map(toIssue));
  const valid = fails.length === 0;
  const status = !valid
    ? blockingFails.length > 0
      ? ("Blocked" as const)
      : ("Invalid" as const)
    : ("Valid" as const);
  const readiness = valid ? ("ReadyForManifest" as const) : ("NotReady" as const);

  return deepFreeze({
    valid,
    status,
    issues,
    warnings: warningIssues,
    ruleResults: frozenRules,
    counts: Object.freeze({
      total: frozenRules.length,
      blocking: blockingFails.length,
      error: fails.filter((r) => !r.blocking).length,
      warning: warnings.length,
      info: passes.length,
      pass: passes.length,
      fail: fails.length,
    }),
    summary: Object.freeze({
      valid,
      status,
      ruleCount: frozenRules.length,
      passCount: passes.length,
      failCount: fails.length,
      warningCount: warnings.length,
      blockingIssueCount: blockingFails.length,
      readiness,
      nextPhase: "DKL-3:5",
      message: valid
        ? "Data Understanding model validation passed. Ready for DKL-3:5 Manifest."
        : "Data Understanding model validation failed.",
    }),
    metadata: METADATA,
    readiness,
  });
}

/** Canonical immutable Data Understanding Validation aggregate. */
export const DataUnderstandingValidation = Object.freeze({
  identity: DATA_UNDERSTANDING_VALIDATION_IDENTITY,
  version: DATA_UNDERSTANDING_VALIDATION_VERSION,
  rules: DataUnderstandingValidationRules,
  ownership: DataUnderstandingValidationOwnership,
  boundaries: DataUnderstandingValidationBoundaries,
  report: DataUnderstandingValidationReport,
  manifest: DataUnderstandingValidationManifest,
  publicApiNames: DATA_UNDERSTANDING_VALIDATION_PUBLIC_API_NAMES,
  dependencies: Object.freeze({
    dkl2PublicIndex: Object.freeze({
      module: "dataSourceKnowledgeRegistryPublicIndex.ts",
      version: DataSourceKnowledgeRegistryPublicIndexVersion,
    }),
    dkl31Foundation: Object.freeze({
      module: "dataUnderstandingFoundation.ts",
      readyForRegistry: DataUnderstandingFoundation.readiness.ReadyForRegistry === true,
    }),
    dkl32Registry: Object.freeze({
      module: "dataUnderstandingRegistry.ts",
      readyForModel: DataUnderstandingRegistry.readiness.ReadyForModel === true,
    }),
    dkl33Model: Object.freeze({
      module: "dataUnderstandingModel.ts",
      readyForValidation: DataUnderstandingModel.readiness.ReadyForValidation === true,
    }),
    pipelineUnderstandingPlatform: Object.freeze({
      module: "pipelineUnderstandingPlatform.ts",
      readyForDKL3Intake:
        PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake === true,
    }),
    forbidden: Object.freeze([
      "DKL-3:5+",
      "DKL-4",
      "Business Objects",
      "Knowledge Graph",
      "Engine",
      "Advisor",
      "Scene",
      "Persistence",
      "AI",
      "Database",
      "Parser internals",
      "Pipeline internals",
      "UI",
      "External packages",
    ]),
  }),
  readiness: Object.freeze({
    ValidationComplete: true,
    FoundationCompliant: true,
    RegistryCompliant: true,
    ModelCompliant: true,
    MetadataOnly: true,
    ValidationOnly: true,
    Deterministic: true,
    Immutable: true,
    UnderstandingForbidden: true,
    CandidateGenerationForbidden: true,
    BusinessObjectCreationForbidden: true,
    KnowledgeGraphForbidden: true,
    PersistenceForbidden: true,
    AIFree: true,
    EngineFree: true,
    ReadyForManifest: true,
  }),
  nextPhase: "DKL-3:5 — Data Understanding Manifest",
  metadataOnly: true,
  validationOnly: true,
  immutable: true,
});

export {
  DataUnderstandingValidationRules,
  DataUnderstandingValidationOwnership,
  DataUnderstandingValidationBoundaries,
  DataUnderstandingValidationManifest,
  DataUnderstandingValidationReport,
};
