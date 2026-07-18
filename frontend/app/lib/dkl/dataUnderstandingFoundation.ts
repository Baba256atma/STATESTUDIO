/**
 * DKL-3:1 — Data Understanding Foundation.
 *
 * Canonical immutable architectural foundation for Nexora’s Data Understanding
 * Platform. Publishes exactly eight runtime APIs. Validates Pipeline intake
 * envelopes without performing semantic inference, Business Object mapping,
 * persistence, AI, or Engine reasoning.
 *
 * Ownership: owned exclusively by DKL-3:1.
 * Dependencies: DKL-2 Public Index + Pipeline Understanding Platform only.
 */

import {
  DataSourceKnowledgeRegistryPublicIndexVersion,
  DataSourceKnowledgeRegistryPublicPlatform,
} from "./dataSourceKnowledgeRegistryPublicIndex.ts";
import { PipelineUnderstandingPlatform } from "../pipeline/pipelineUnderstandingPlatform.ts";
import { DataUnderstandingBoundaries } from "./dataUnderstandingBoundaries.ts";
import {
  DataUnderstandingContracts,
  DATA_UNDERSTANDING_PROCESSING_POLICIES,
  UNDERSTANDING_SCOPES,
} from "./dataUnderstandingContracts.ts";
import { DataUnderstandingEvidenceCatalog } from "./dataUnderstandingEvidence.ts";
import { DataUnderstandingLifecycle } from "./dataUnderstandingLifecycle.ts";
import { DataUnderstandingOwnership } from "./dataUnderstandingOwnership.ts";
import type {
  DataUnderstandingFoundationIdentity,
  DataUnderstandingFoundationInput,
  DataUnderstandingFoundationValidationResult,
  FoundationValidationIssue,
  PipelineIntakePackageView,
  UnderstandingScope,
} from "./dataUnderstandingFoundationTypes.ts";

export const DataUnderstandingFoundationVersion = "1.0.0";

const FOUNDATION_IDENTITY: DataUnderstandingFoundationIdentity = Object.freeze({
  foundationId: "DKL-3:1/DataUnderstandingFoundation",
  foundationVersion: DataUnderstandingFoundationVersion,
  foundationName: "Data Understanding Foundation",
  foundationNamespace: "nexora.dkl.data-understanding.foundation",
  owner: "DKL-3 Data Understanding Platform",
  sourcePhase: "DKL-3:1",
  platformId: "DKL-3",
  platformVersion: DataUnderstandingFoundationVersion,
  status: "FoundationComplete",
  readiness: "ReadyForRegistry",
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

const issue = (
  code: string,
  severity: FoundationValidationIssue["severity"],
  message: string,
  field: string | null = null,
): FoundationValidationIssue =>
  Object.freeze({ code, severity, message, field });

const isRecognizedScope = (scope: string): scope is UnderstandingScope =>
  (UNDERSTANDING_SCOPES as readonly string[]).includes(scope);

const collectKnownSubjectIds = (
  pkg: PipelineIntakePackageView,
): ReadonlySet<string> => {
  const ids = new Set<string>();
  ids.add(pkg.identity.datasetId);
  ids.add(`dataset:${pkg.identity.datasetId}`);
  for (const column of pkg.columns) {
    ids.add(column.key);
    ids.add(`column:${column.key}`);
  }
  ids.add(`source:${pkg.source.sourceRegistryId}`);
  ids.add(`handoff:${pkg.identity.handoffId}`);
  return ids;
};

const buildValidationResult = (
  issues: readonly FoundationValidationIssue[],
): DataUnderstandingFoundationValidationResult => {
  const blocking = issues.filter(
    (i) => i.severity === "Blocking" || i.severity === "Error",
  );
  const warnings = issues.filter((i) => i.severity === "Warning");
  const hasBlockingDiagnostics = issues.some((i) => i.code === "BLOCKING_DIAGNOSTICS");
  const valid = blocking.length === 0;
  const status = !valid
    ? hasBlockingDiagnostics || issues.some((i) => i.severity === "Blocking")
      ? ("Blocked" as const)
      : ("Invalid" as const)
    : ("Valid" as const);

  return deepFreeze({
    valid,
    status,
    issues: Object.freeze([...issues]),
    warnings: Object.freeze([...warnings]),
    blockingIssueCount: blocking.length,
    warningCount: warnings.length,
    readiness: valid ? ("ReadyForRegistry" as const) : ("NotReady" as const),
  });
};

/**
 * Validate a Data Understanding foundation input envelope.
 * Does not generate semantic candidates. Does not mutate input. Does not throw
 * for ordinary invalid input.
 */
export function validateDataUnderstandingFoundationInput(
  input: DataUnderstandingFoundationInput | null | undefined,
): DataUnderstandingFoundationValidationResult {
  try {
    if (input === null || input === undefined || typeof input !== "object") {
      return buildValidationResult([
        issue("MISSING_INPUT", "Blocking", "Foundation input envelope is required."),
      ]);
    }

    const issues: FoundationValidationIssue[] = [];
    const pkg = input.intakePackage;

    if (pkg === null || pkg === undefined || typeof pkg !== "object") {
      issues.push(issue("MISSING_INTAKE", "Blocking", "Validated Pipeline intake package is required.", "intakePackage"));
      return buildValidationResult(issues);
    }

    if (!pkg.identity || typeof pkg.identity !== "object") {
      issues.push(issue("MISSING_IDENTITY", "Blocking", "Intake identity section is required.", "identity"));
      return buildValidationResult(issues);
    }

    if (!pkg.identity.tenantId || pkg.identity.tenantId.trim().length === 0) {
      issues.push(issue("MISSING_TENANT", "Blocking", "Tenant identity is required.", "tenantId"));
    }
    if (!pkg.identity.workspaceId || pkg.identity.workspaceId.trim().length === 0) {
      issues.push(issue("MISSING_WORKSPACE", "Blocking", "Workspace identity is required.", "workspaceId"));
    }
    if (!pkg.identity.sessionId || pkg.identity.sessionId.trim().length === 0) {
      issues.push(issue("MISSING_SESSION", "Blocking", "Session identity is required.", "sessionId"));
    }
    if (!pkg.identity.datasetId || pkg.identity.datasetId.trim().length === 0) {
      issues.push(issue("MISSING_DATASET", "Blocking", "Dataset identity is required.", "datasetId"));
    }

    if (pkg.readiness?.contractValid !== true) {
      issues.push(
        issue(
          "INTAKE_NOT_CONTRACT_VALID",
          "Blocking",
          "Intake package must be contract-valid.",
          "readiness.contractValid",
        ),
      );
    }

    if (pkg.readiness?.readyForDKL3Intake !== true) {
      issues.push(
        issue(
          "INTAKE_NOT_READY",
          "Blocking",
          "Intake package must be ready for DKL-3 intake.",
          "readiness.readyForDKL3Intake",
        ),
      );
    }

    if (pkg.review?.confirmed !== true || pkg.readiness?.reviewConfirmed !== true) {
      issues.push(
        issue(
          "INTAKE_UNCONFIRMED",
          "Blocking",
          "Intake package must be explicitly confirmed.",
          "review.confirmed",
        ),
      );
    }

    if (pkg.dataset?.dataScope !== "PreviewOnly" || pkg.boundaries?.previewOnly !== true) {
      issues.push(
        issue(
          "PREVIEW_ONLY_REQUIRED",
          "Blocking",
          "Preview-only scope must be preserved.",
          "dataset.dataScope",
        ),
      );
    }

    const selectedKeys = pkg.review?.selectedColumnKeys ?? [];
    const columnKeys = new Set((pkg.columns ?? []).map((c) => c.key));
    if (selectedKeys.length === 0 || (pkg.columns?.length ?? 0) === 0) {
      issues.push(
        issue(
          "ZERO_SELECTED_COLUMNS",
          "Blocking",
          "At least one selected column is required.",
          "review.selectedColumnKeys",
        ),
      );
    } else {
      for (const key of selectedKeys) {
        if (!columnKeys.has(key)) {
          issues.push(
            issue(
              "SELECTED_COLUMN_MISSING",
              "Blocking",
              `Selected column key is not present in intake columns: ${key}`,
              "review.selectedColumnKeys",
            ),
          );
        }
      }
    }

    if (
      pkg.diagnostics?.hasBlockingIssues === true ||
      (pkg.diagnostics?.diagnosticCounts?.blocking ?? 0) > 0 ||
      (pkg.readiness?.blockingIssueCount ?? 0) > 0
    ) {
      issues.push(
        issue(
          "BLOCKING_DIAGNOSTICS",
          "Blocking",
          "Blocking diagnostics prevent foundation validation.",
          "diagnostics",
        ),
      );
    }

    const registry = DataSourceKnowledgeRegistryPublicPlatform.registry;
    const sourceOk =
      typeof pkg.source?.sourceRegistryId === "string" &&
      registry.dataSources.getById(pkg.source.sourceRegistryId) !== undefined;
    const connectorOk =
      typeof pkg.source?.connectorRegistryId === "string" &&
      registry.connectors.getById(pkg.source.connectorRegistryId) !== undefined;
    const contentOk =
      typeof pkg.source?.contentTypeRegistryId === "string" &&
      registry.contentTypes.getById(pkg.source.contentTypeRegistryId) !== undefined;

    if (!sourceOk || !connectorOk || !contentOk || pkg.readiness?.sourceReferencesValid !== true) {
      issues.push(
        issue(
          "SOURCE_REFERENCES_UNRESOLVED",
          "Blocking",
          "DKL-2 source, connector, and content-type references must remain resolved.",
          "source",
        ),
      );
    }

    if (!isRecognizedScope(String(input.requestedUnderstandingScope))) {
      issues.push(
        issue(
          "UNRECOGNIZED_SCOPE",
          "Blocking",
          `Requested understanding scope is not recognized: ${String(input.requestedUnderstandingScope)}`,
          "requestedUnderstandingScope",
        ),
      );
    }

    if (Array.isArray(input.requestedSubjectIds) && input.requestedSubjectIds.length > 0) {
      const known = collectKnownSubjectIds(pkg);
      for (const subjectId of input.requestedSubjectIds) {
        if (!known.has(subjectId)) {
          issues.push(
            issue(
              "UNKNOWN_SUBJECT",
              "Blocking",
              `Requested subject id does not belong to the intake package: ${subjectId}`,
              "requestedSubjectIds",
            ),
          );
        }
      }
    }

    if (input.processingPolicy?.previewOnlyInputRequired !== true) {
      issues.push(
        issue(
          "POLICY_PREVIEW_ONLY_REQUIRED",
          "Blocking",
          "Processing policy must require preview-only input.",
          "processingPolicy.previewOnlyInputRequired",
        ),
      );
    }

    if (input.processingPolicy?.allowCanonicalBusinessObjects === true) {
      issues.push(
        issue(
          "POLICY_BUSINESS_OBJECTS_FORBIDDEN",
          "Blocking",
          "Canonical Business Object creation is forbidden.",
          "processingPolicy.allowCanonicalBusinessObjects",
        ),
      );
    }

    if (input.processingPolicy?.allowPersistence === true) {
      issues.push(
        issue(
          "POLICY_PERSISTENCE_FORBIDDEN",
          "Blocking",
          "Persistence is forbidden.",
          "processingPolicy.allowPersistence",
        ),
      );
    }

    if (input.processingPolicy?.allowAiProviderCalls === true) {
      issues.push(
        issue(
          "POLICY_AI_FORBIDDEN",
          "Blocking",
          "AI provider calls are forbidden.",
          "processingPolicy.allowAiProviderCalls",
        ),
      );
    }

    if (input.processingPolicy?.allowExecutiveReasoning === true) {
      issues.push(
        issue(
          "POLICY_ENGINE_FORBIDDEN",
          "Blocking",
          "Executive Engine reasoning is forbidden.",
          "processingPolicy.allowExecutiveReasoning",
        ),
      );
    }

    // Ensure Public Index version and Pipeline platform remain referenced.
    void DataSourceKnowledgeRegistryPublicIndexVersion;
    void PipelineUnderstandingPlatform;
    void DATA_UNDERSTANDING_PROCESSING_POLICIES;

    return buildValidationResult(issues);
  } catch {
    return buildValidationResult([
      issue(
        "UNEXPECTED_VALIDATION_FAILURE",
        "Blocking",
        "Foundation validation failed without throwing to the caller.",
      ),
    ]);
  }
}

const DEPENDENCIES = Object.freeze({
  dkl2PublicIndex: "dataSourceKnowledgeRegistryPublicIndex.ts",
  pipelineUnderstandingPlatform: "pipelineUnderstandingPlatform.ts",
  dkl2RegistryVersion: DataSourceKnowledgeRegistryPublicIndexVersion,
  pipelineContractReady:
    PipelineUnderstandingPlatform.readiness.ReadyForDKL3Intake === true,
  forbidden: Object.freeze([
    "DKL-2 internal phase modules",
    "pipeline internal builders",
    "INT parser internals",
    "DKL-3:2+",
    "DKL-4",
    "Business Object Mapping",
    "Persistence",
    "Engine",
    "Advisor",
    "Director",
    "Scene",
    "EVE",
    "NEA",
    "OPS",
    "BUS",
    "database clients",
    "external AI or LLM services",
  ]),
});

const READINESS = Object.freeze({
  FoundationComplete: true,
  PipelineContractConnected: true,
  Dkl2RegistryConnected: true,
  PreviewOnly: true,
  SemanticCandidatesDefined: true,
  EvidenceModelDefined: true,
  AmbiguityPreserved: true,
  ClarificationContractsDefined: true,
  BusinessObjectCreationForbidden: true,
  PersistenceForbidden: true,
  AiExecutionForbidden: true,
  AIFree: true,
  EngineFree: true,
  Deterministic: true,
  Immutable: true,
  ReadyForRegistry: true,
});

/** Canonical immutable Data Understanding Foundation aggregate. */
export const DataUnderstandingFoundation = Object.freeze({
  identity: FOUNDATION_IDENTITY,
  contracts: DataUnderstandingContracts,
  ownership: DataUnderstandingOwnership,
  boundaries: DataUnderstandingBoundaries,
  lifecycle: DataUnderstandingLifecycle,
  evidence: DataUnderstandingEvidenceCatalog,
  policies: DATA_UNDERSTANDING_PROCESSING_POLICIES,
  dependencies: DEPENDENCIES,
  readiness: READINESS,
  completionStatus: Object.freeze([
    "FoundationComplete",
    "PipelineContractConnected",
    "Dkl2RegistryConnected",
    "PreviewOnly",
    "EvidenceModelDefined",
    "SemanticCandidateContractsDefined",
    "AmbiguityPreserved",
    "ClarificationContractsDefined",
    "BusinessObjectCreationForbidden",
    "PersistenceForbidden",
    "AIFree",
    "EngineFree",
    "Deterministic",
    "Immutable",
    "ReadyForRegistry",
  ]),
  nextPhase: "DKL-3:2 — Data Understanding Registry",
});

export {
  DataUnderstandingContracts,
  DataUnderstandingOwnership,
  DataUnderstandingBoundaries,
  DataUnderstandingLifecycle,
  DataUnderstandingEvidenceCatalog,
};
