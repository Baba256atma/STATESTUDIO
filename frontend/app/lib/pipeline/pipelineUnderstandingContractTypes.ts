/**
 * UI-PIPE-1:3 — Pipeline-to-DKL-3 Handoff Contract Types.
 *
 * Readonly contracts for the immutable intake package connecting reviewed
 * Pipeline Preview to future DKL-3 Data Understanding. Preview-only. No
 * semantic fields. No persistence. No runtime behavior.
 *
 * Ownership: owned exclusively by UI-PIPE-1:3.
 */

import type {
  CanonicalParsedDataset,
  ParseStatus,
  ProvisionalPrimitiveType,
} from "../integrations/csvParserTypes.ts";
import type { PipelineDiagnosticCounts } from "./pipelinePageTypes.ts";
import type { PipelineUnderstandingHandoff } from "./pipelinePreviewTypes.ts";

export type ContractValidationStatus = "PASS" | "FAIL" | "WARNING";
export type ContractValidationCategory =
  | "Identity"
  | "SourceReference"
  | "Dataset"
  | "ColumnSelection"
  | "Diagnostics"
  | "Review"
  | "Boundary";

export type CompatibilityStatus =
  | "Compatible"
  | "Restricted"
  | "Forbidden"
  | "FutureCompatible";

export interface PipelineUnderstandingContractIdentity {
  readonly contractId: string;
  readonly contractVersion: string;
  readonly contractName: string;
  readonly contractNamespace: string;
  readonly owner: string;
  readonly sourcePhase: string;
  readonly sourcePlatform: "UI-PIPE-1";
  readonly targetPlatform: "DKL-3";
  readonly status: "ContractComplete";
  readonly readiness: "ReadyForDKL3Intake";
}

export interface IntakeIdentitySection {
  readonly intakeId: string;
  readonly contractVersion: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly sessionId: string;
  readonly datasetId: string;
  readonly handoffId: string;
  readonly sourcePhase: "UI-PIPE-1:3";
  readonly targetPhase: "DKL-3";
}

export interface IntakeSourceSection {
  readonly sourceMode: string;
  readonly sourceName: string;
  readonly sourceRegistryId: string;
  readonly connectorRegistryId: string;
  readonly contentTypeRegistryId: string;
  readonly dklRegistryVersion: string;
}

export interface IntakeDatasetSection {
  readonly datasetName: string;
  readonly encoding: string;
  readonly delimiter: string;
  readonly hasHeader: boolean;
  readonly columnCount: number;
  readonly selectedColumnCount: number;
  readonly rowCountObserved: number;
  readonly rowCountParsed: number;
  readonly rowCountPreviewed: number;
  readonly parseStatus: ParseStatus;
  readonly truncated: boolean;
  readonly dataScope: "PreviewOnly";
}

export interface IntakeColumnProjection {
  readonly index: number;
  readonly key: string;
  readonly originalName: string;
  readonly displayName: string;
  readonly primitiveType: ProvisionalPrimitiveType;
  readonly nonEmptySampleCount: number;
  readonly emptyValueCount: number;
  readonly formulaRiskCount: number;
  readonly sampleValues: readonly string[];
  readonly diagnosticCodes: readonly string[];
  readonly selectionStatus: "SelectedForUnderstanding";
}

export interface IntakePreviewEvidenceRow {
  readonly rowIndex: number;
  readonly values: Readonly<Record<string, string>>;
  readonly hasFormulaRisk: boolean;
}

export interface IntakePreviewEvidenceSection {
  readonly previewRowCount: number;
  readonly previewRows: readonly IntakePreviewEvidenceRow[];
  readonly sampleCoverage: number;
  readonly columnCoverage: number;
  readonly isTruncated: boolean;
  readonly evidenceScope: "ParserPreviewEvidence";
}

export interface IntakeDiagnosticEntry {
  readonly code: string;
  readonly category: string;
  readonly severity: string;
  readonly field: string | null;
  readonly rowIndex: number | null;
  readonly columnIndex: number | null;
  readonly recoverable: boolean;
  readonly message: string;
}

export interface IntakeDiagnosticsSection {
  readonly diagnosticCounts: PipelineDiagnosticCounts;
  readonly blockingDiagnostics: readonly IntakeDiagnosticEntry[];
  readonly errorDiagnostics: readonly IntakeDiagnosticEntry[];
  readonly warningDiagnostics: readonly IntakeDiagnosticEntry[];
  readonly infoDiagnostics: readonly IntakeDiagnosticEntry[];
  readonly formulaRiskCount: number;
  readonly hasBlockingIssues: boolean;
}

export interface IntakeReviewSection {
  readonly reviewStatus: "ReadyForUnderstanding" | "NotConfirmed";
  readonly confirmed: boolean;
  readonly selectedColumnKeys: readonly string[];
  readonly confirmedBy: string;
  readonly confirmationSource: "PipelinePreview";
  readonly readyForUnderstanding: boolean;
}

export interface IntakeBoundariesSection {
  readonly tenantBoundaryPreserved: true;
  readonly workspaceBoundaryPreserved: true;
  readonly sessionBoundaryPreserved: true;
  readonly previewOnly: true;
  readonly persistencePerformed: false;
  readonly semanticUnderstandingPerformed: false;
  readonly businessObjectMappingPerformed: false;
  readonly aiInferencePerformed: false;
  readonly engineReasoningPerformed: false;
}

export interface IntakeReadinessSection {
  readonly contractValid: boolean;
  readonly sourceReferencesValid: boolean;
  readonly identityValid: boolean;
  readonly selectedColumnsValid: boolean;
  readonly diagnosticsAcceptable: boolean;
  readonly reviewConfirmed: boolean;
  readonly boundaryIntegrityValid: boolean;
  readonly readyForDKL3Intake: boolean;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly nextPlatform: "DKL-3";
}

export interface PipelineUnderstandingIntakePackage {
  readonly identity: IntakeIdentitySection;
  readonly source: IntakeSourceSection;
  readonly dataset: IntakeDatasetSection;
  readonly columns: readonly IntakeColumnProjection[];
  readonly previewEvidence: IntakePreviewEvidenceSection;
  readonly diagnostics: IntakeDiagnosticsSection;
  readonly review: IntakeReviewSection;
  readonly boundaries: IntakeBoundariesSection;
  readonly readiness: IntakeReadinessSection;
}

export interface ContractValidationRule {
  readonly ruleId: string;
  readonly category: ContractValidationCategory;
  readonly name: string;
  readonly description: string;
  readonly blocking: boolean;
}

export interface ContractValidationResult {
  readonly ruleId: string;
  readonly category: ContractValidationCategory;
  readonly status: ContractValidationStatus;
  readonly severity: "Blocking" | "Error" | "Warning" | "Info";
  readonly message: string;
  readonly evidence: string;
  readonly blocking: boolean;
}

export interface CompatibilityDeclaration {
  readonly compatibilityId: string;
  readonly name: string;
  readonly status: CompatibilityStatus;
  readonly description: string;
}

export interface PipelineUnderstandingContractManifest {
  readonly contractId: string;
  readonly version: string;
  readonly name: string;
  readonly owner: string;
  readonly sourcePlatforms: readonly string[];
  readonly targetPlatform: "DKL-3";
  readonly sectionCount: 9;
  readonly validationRuleCount: 18;
  readonly compatibilityCount: 8;
  readonly requiredIdentityFields: readonly string[];
  readonly requiredSourceReferences: readonly string[];
  readonly metadataOnly: true;
  readonly previewOnly: true;
  readonly deterministic: true;
  readonly immutable: true;
  readonly persistenceFree: true;
  readonly semanticFree: true;
  readonly aiFree: true;
  readonly readiness: "ReadyForDKL3Intake";
  readonly nextPhase: "DKL-3:1";
}

export interface PipelineUnderstandingContractSummary {
  readonly contractValid: boolean;
  readonly readyForDKL3Intake: boolean;
  readonly sectionCount: number;
  readonly selectedColumnCount: number;
  readonly blockingIssueCount: number;
  readonly warningCount: number;
  readonly validationPassCount: number;
  readonly validationFailCount: number;
  readonly dataScope: "PreviewOnly";
  readonly targetPlatform: "DKL-3";
  readonly nextPhase: "DKL-3:1";
}

export interface CreateIntakePackageInput {
  readonly dataset: CanonicalParsedDataset;
  readonly handoff: PipelineUnderstandingHandoff;
  readonly confirmedBy: string;
  /** Optional overrides for negative-path testing (never used in production UI). */
  readonly overrides?: {
    readonly tenantId?: string;
    readonly workspaceId?: string;
    readonly sessionId?: string;
    readonly datasetId?: string;
    readonly handoffId?: string;
    readonly selectedColumnKeys?: readonly string[];
    readonly sourceRegistryId?: string;
    readonly connectorRegistryId?: string;
    readonly contentTypeRegistryId?: string;
    readonly reviewConfirmed?: boolean;
    readonly injectSemanticField?: boolean;
    readonly injectPersistenceField?: boolean;
  };
}

export interface PipelineUnderstandingIntakeSuccess {
  readonly ok: true;
  readonly package: PipelineUnderstandingIntakePackage;
  readonly validationResults: readonly ContractValidationResult[];
  readonly summary: PipelineUnderstandingContractSummary;
}

export interface PipelineUnderstandingIntakeFailure {
  readonly ok: false;
  readonly validationResults: readonly ContractValidationResult[];
  readonly failure: {
    readonly code: string;
    readonly message: string;
  };
  readonly partialPackage: PipelineUnderstandingIntakePackage | null;
  readonly summary: PipelineUnderstandingContractSummary;
}

export type PipelineUnderstandingIntakeResult =
  | PipelineUnderstandingIntakeSuccess
  | PipelineUnderstandingIntakeFailure;

export const INTAKE_SECTION_ORDER = Object.freeze([
  "identity",
  "source",
  "dataset",
  "columns",
  "previewEvidence",
  "diagnostics",
  "review",
  "boundaries",
  "readiness",
] as const);

export type IntakeSectionName = (typeof INTAKE_SECTION_ORDER)[number];
