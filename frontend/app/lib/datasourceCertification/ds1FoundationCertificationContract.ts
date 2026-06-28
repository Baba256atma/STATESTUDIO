/**
 * PHASE-2 / DS1:7 — DS-1 Foundation Certification contract.
 * Platform orchestration vocabulary — architecture validation only.
 */

import { resolveBusinessKnowledgeConceptExample } from "../businessKnowledge/businessKnowledgeLayerContract.ts";
import { resolveExecutiveBusinessDataSourceExample } from "../datasource/executiveBusinessDataSourceContract.ts";
import { resolveWorkspaceRegistryAdapterLinkExample } from "../datasource/workspaceDataSourceRegistryAdapterContract.ts";
import { resolveDataSourceStatusSnapshotExample } from "../dataSourceStatus/dataSourceStatusContract.ts";
import {
  WIZARD_IDSC_ALIGNMENT_SOURCE,
  WIZARD_IDSC_ALIGNMENT_VERSION,
  resolveManageWizardRequestBundleExample,
} from "../manageWizard/manageWizardIntegrationContract.ts";
import { resolveSourceRegistrationRequestExample } from "../inputCenter/inputDataSourceCenterContract.ts";
import {
  STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  STAGE_MINIMUM_OVERALL_SCORE,
  STAGE_SCORE_WEIGHTS,
} from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import type {
  Ds1FoundationLayerId,
  Ds1FoundationScoreDimensions,
} from "./ds1FoundationCertificationTypes.ts";

export const DS1_FOUNDATION_CERTIFICATION_VERSION = "PHASE-2/DS1:7" as const;
export const DS1_FOUNDATION_CERTIFICATION_SOURCE = "phase-2-ds1-foundation-certification" as const;
export const NEXORA_DS1_FOUNDATION_LOG_PREFIX = "[NexoraDs1Foundation]" as const;

export const DS1_FOUNDATION_MINIMUM_OVERALL_SCORE = 98 as const;

export const DS1_FOUNDATION_CERTIFICATION_TAGS = Object.freeze([
  "[DS17_FOUNDATION_CERTIFICATION]",
  "[DS1_FOUNDATION_PLATFORM]",
  "[PHASE2_DS1_FOUNDATION_READY]",
] as const);

export const DS1_FOUNDATION_FREEZE_TAGS = Object.freeze([
  "[DS1_7_CERTIFIED]",
  "[DS1_FOUNDATION_CERTIFIED]",
  "[DS1_FOUNDATION_FROZEN]",
  "[PHASE2_DS1_COMPLETE]",
] as const);

export const DS1_FOUNDATION_LAYER_CHAIN = Object.freeze([
  Object.freeze({ layerId: "DS1:1" as const, title: "Executive Business Data Source", runnerKey: "ebds" as const }),
  Object.freeze({ layerId: "DS1:2" as const, title: "Workspace Registry Adapter", runnerKey: "adapter" as const }),
  Object.freeze({ layerId: "DS1:3" as const, title: "Business Knowledge Layer", runnerKey: "bkl" as const }),
  Object.freeze({ layerId: "DS1:4" as const, title: "Input / Data Source Center", runnerKey: "idsc" as const }),
  Object.freeze({ layerId: "DS1:5" as const, title: "Manage Wizard Integration", runnerKey: "mwi" as const }),
  Object.freeze({ layerId: "DS1:6" as const, title: "Data Source Status", runnerKey: "dss" as const }),
] as const);

export const DS1_FOUNDATION_MUST_NOT_OWN = Object.freeze([
  "upload_execution",
  "import_execution",
  "validation_execution",
  "parsing",
  "synchronization",
  "registry_runtime",
  "registry_mutation",
  "polling",
  "background_jobs",
  "business_rules",
  "business_knowledge_semantics",
  "ai_reasoning",
  "intelligence",
  "dashboard_rendering",
  "assistant_logic",
  "status_snapshot_production",
  "layer_contract_mutation",
] as const);

export const DS1_FOUNDATION_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "data-sources/dataSourceRegistryRuntime",
  "workspace/workspaceDataSourceRegistry.ts",
  "workspaceRegistryStore",
  "dashboardIntelligence/",
  "executiveIntelligencePlatform/",
  "assistantRuntime",
  "RelationshipRenderer",
  "ParserEngine",
  "ImportEngine",
  "ValidationEngine",
  "SynchronizationEngine",
  ".tsx",
] as const);

export const DS1_FOUNDATION_SELF_MANIFEST = Object.freeze({
  stageId: "PHASE-2/DS1:7",
  title: "DS-1 Foundation Certification",
  goal: "Library-only meta-certification orchestrator for DS1:1 through DS1:6 foundation platform.",
  lifecycle: "analyze" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/datasourceCertification/ds1FoundationCertificationTypes.ts",
    "frontend/app/lib/datasourceCertification/ds1FoundationCertificationContract.ts",
    "frontend/app/lib/datasourceCertification/ds1FoundationCertificationDiagnostics.ts",
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.test.ts",
    "docs/ds1-7-build-report.md",
    "docs/ds1-7-analysis-report.md",
    "docs/ds1-7-freeze-report.md",
  ]),
  forbiddenPatterns: DS1_FOUNDATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "DS1:1",
    "DS1:2",
    "DS1:3",
    "DS1:4",
    "DS1:5",
    "DS1:6",
    "STAGE-ARCH-3",
    "INT-5",
  ]),
  runtimePath: "library-only" as const,
  tags: DS1_FOUNDATION_CERTIFICATION_TAGS,
} satisfies StageManifest);

export const DS1_FOUNDATION_MODULE_PATHS = Object.freeze(
  DS1_FOUNDATION_SELF_MANIFEST.allowedFiles.filter((entry) => entry.endsWith(".ts"))
);

const FOUNDATION_WORKSPACE = "workspace-example-001";

export function computeDs1FoundationOverallScore(dimensions: Ds1FoundationScoreDimensions): number {
  const weighted =
    dimensions.architecture * STAGE_SCORE_WEIGHTS.architecture +
    dimensions.maintainability * STAGE_SCORE_WEIGHTS.maintainability +
    dimensions.regressionSafety * STAGE_SCORE_WEIGHTS.regressionSafety +
    dimensions.scalability * STAGE_SCORE_WEIGHTS.scalability +
    dimensions.certificationReadiness * STAGE_SCORE_WEIGHTS.certificationReadiness;
  return Math.round(Math.min(100, Math.max(0, weighted)));
}

export function meetsDs1FoundationMinimumScore(overall: number): boolean {
  return overall >= DS1_FOUNDATION_MINIMUM_OVERALL_SCORE;
}

export function meetsStageMinimumScore(overall: number): boolean {
  return overall >= STAGE_MINIMUM_OVERALL_SCORE;
}

/** I1 — DS1:1 → DS1:2 semantic-to-adapter alignment */
export function validateEbdsAdapterIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const ebds = resolveExecutiveBusinessDataSourceExample("operational");
  const adapter = resolveWorkspaceRegistryAdapterLinkExample("operational");
  const aligned =
    ebds.workspaceId === adapter.workspaceId &&
    ebds.businessDataSourceId === adapter.businessDataSourceId &&
    adapter.workspaceId === FOUNDATION_WORKSPACE;
  return Object.freeze({
    valid: aligned,
    evidence: aligned
      ? `Aligned on ${ebds.businessDataSourceId} in ${ebds.workspaceId}.`
      : "EBDS and adapter example workspace or businessDataSourceId mismatch.",
  });
}

/** I2 — DS1:1 → DS1:3 semantic binding readiness */
export function validateEbdsBklIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const ebds = resolveExecutiveBusinessDataSourceExample("operational");
  const bkl = resolveBusinessKnowledgeConceptExample("business_domain");
  const ready =
    bkl.workspaceId === ebds.workspaceId &&
    (bkl.bindings?.businessDataSourceIds?.includes(ebds.businessDataSourceId) ?? false);
  return Object.freeze({
    valid: ready,
    evidence: ready
      ? `BKL bindings reference ${ebds.businessDataSourceId}.`
      : "BKL example missing EBDS businessDataSourceId binding.",
  });
}

/** I3 — DS1:4 → DS1:5 request bundle compatibility */
export function validateIdscMwiIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const idsc = resolveSourceRegistrationRequestExample("csv");
  const bundle = resolveManageWizardRequestBundleExample();
  const compatible =
    bundle.registrationRequest.source === WIZARD_IDSC_ALIGNMENT_SOURCE &&
    bundle.registrationRequest.contractVersion === WIZARD_IDSC_ALIGNMENT_VERSION &&
    bundle.registrationRequest.workspaceId === idsc.workspaceId &&
    bundle.registrationRequest.requestType === "register";
  return Object.freeze({
    valid: compatible,
    evidence: compatible
      ? `MWI bundle aligned to IDSC via ${WIZARD_IDSC_ALIGNMENT_SOURCE}.`
      : "MWI bundle IDSC alignment markers or workspace mismatch.",
  });
}

/** I4 — DS1:4 → DS1:6 request status signal readiness */
export function validateIdscDssIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const idsc = resolveSourceRegistrationRequestExample("csv");
  const snapshot = resolveDataSourceStatusSnapshotExample();
  const ready =
    snapshot.observedFrom.includes("DS1:4") &&
    snapshot.metadata.requestIds !== undefined &&
    snapshot.metadata.requestIds.length > 0 &&
    snapshot.workspaceId === idsc.workspaceId;
  return Object.freeze({
    valid: ready,
    evidence: ready
      ? "DSS snapshot declares DS1:4 signal source and requestIds."
      : "DSS snapshot missing DS1:4 signal source or request correlation.",
  });
}

/** I5 — DS1:5 → DS1:6 wizard status signal readiness */
export function validateMwiDssIntegration(): Readonly<{ valid: boolean; evidence: string }> {
  const bundle = resolveManageWizardRequestBundleExample();
  const snapshot = resolveDataSourceStatusSnapshotExample();
  const wizardSessionId = snapshot.metadata.wizardSessionId?.trim() ?? "";
  const ready =
    wizardSessionId.length > 0 &&
    bundle.wizardSessionId === wizardSessionId &&
    snapshot.workspaceId === bundle.workspaceId;
  return Object.freeze({
    valid: ready,
    evidence: ready
      ? `DSS metadata correlates wizard session ${wizardSessionId}.`
      : "DSS snapshot missing wizardSessionId or workspace correlation with MWI bundle.",
  });
}

/** I6 — Workspace isolation across all foundation examples */
export function validateFoundationWorkspaceIsolation(): Readonly<{ valid: boolean; evidence: string }> {
  const ebds = resolveExecutiveBusinessDataSourceExample("operational");
  const adapter = resolveWorkspaceRegistryAdapterLinkExample("operational");
  const bkl = resolveBusinessKnowledgeConceptExample("business_domain");
  const idsc = resolveSourceRegistrationRequestExample("csv");
  const bundle = resolveManageWizardRequestBundleExample();
  const snapshot = resolveDataSourceStatusSnapshotExample();
  const workspaceIds = [
    ebds.workspaceId,
    adapter.workspaceId,
    bkl.workspaceId,
    idsc.workspaceId,
    bundle.workspaceId,
    snapshot.workspaceId,
  ];
  const isolated = workspaceIds.every((id) => id === FOUNDATION_WORKSPACE);
  return Object.freeze({
    valid: isolated,
    evidence: isolated
      ? `All six layer examples scoped to ${FOUNDATION_WORKSPACE}.`
      : "Foundation examples contain inconsistent workspaceId values.",
  });
}

export function resolveFoundationLayerIds(): readonly Ds1FoundationLayerId[] {
  return DS1_FOUNDATION_LAYER_CHAIN.map((entry) => entry.layerId);
}
