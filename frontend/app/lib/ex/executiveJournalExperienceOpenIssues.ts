/**
 * EX-2:1 — Executive Journal Experience Foundation Open Issues.
 *
 * Unresolved production/integration issues and pending EX-2 gates carried
 * by EX-2:1. Distinguishes Foundation readiness from production readiness.
 * Does not mark any issue resolved by assumption.
 *
 * Ownership: owned exclusively by EX-2:1.
 */

import {
  ExecutiveJournalProductArchitectureGates,
  getExecutiveJournalProductArchitectureGate,
} from "./executiveJournalProductArchitecture.ts";
import type { ExecutiveJournalExperienceOpenIssueDescriptor } from "./executiveJournalExperienceTypes.ts";

const gate04 = getExecutiveJournalProductArchitectureGate("G-EX2-04");
const gate07 = getExecutiveJournalProductArchitectureGate("G-EX2-07");
const gate12 = getExecutiveJournalProductArchitectureGate("G-EX2-12");

/**
 * Exact pending-gate references preserved from architecture.
 * Remain Pending; do not block metadata-only ReadyForRegistry;
 * continue blocking applicable production claims.
 */
export const ExecutiveJournalExperiencePendingGates = Object.freeze([
  Object.freeze({
    gateId: "G-EX2-04" as const,
    name: gate04.name,
    result: gate04.result,
    expectedResult: "Pending" as const,
    description: "real provider/source compatibility" as const,
    blocksFoundationReadiness: false as const,
    blocksProductionReadiness: true as const,
    carriedByPhase: "EX-2:1" as const,
    record: gate04,
  }),
  Object.freeze({
    gateId: "G-EX2-07" as const,
    name: gate07.name,
    result: gate07.result,
    expectedResult: "Pending" as const,
    description: "final production allowlist" as const,
    blocksFoundationReadiness: false as const,
    blocksProductionReadiness: true as const,
    carriedByPhase: "EX-2:1" as const,
    record: gate07,
  }),
  Object.freeze({
    gateId: "G-EX2-12" as const,
    name: gate12.name,
    result: gate12.result,
    expectedResult: "Pending" as const,
    description: "production telemetry policy" as const,
    blocksFoundationReadiness: false as const,
    blocksProductionReadiness: true as const,
    carriedByPhase: "EX-2:1" as const,
    record: gate12,
  }),
] as const);

export const ExecutiveJournalExperiencePendingGateIds = Object.freeze([
  "G-EX2-04",
  "G-EX2-07",
  "G-EX2-12",
] as const);

export const ExecutiveJournalExperienceOpenIssues:
  readonly ExecutiveJournalExperienceOpenIssueDescriptor[] = Object.freeze([
    Object.freeze({
      issueId: "G-EX2-04" as const,
      description: "real provider/source compatibility" as const,
      owner: "RTC Journal Operations / EX Architecture" as const,
      status: "Unresolved" as const,
      blockingScope: "ProductionProviderCompatibility" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
      gateResult: "Pending" as const,
    }),
    Object.freeze({
      issueId: "G-EX2-07" as const,
      description: "final production allowlist" as const,
      owner: "EX Product and Architecture Authority" as const,
      status: "Unresolved" as const,
      blockingScope: "ProductionAllowlist" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
      gateResult: "Pending" as const,
    }),
    Object.freeze({
      issueId: "G-EX2-12" as const,
      description: "production telemetry policy" as const,
      owner: "EX Product and Architecture Authority" as const,
      status: "Unresolved" as const,
      blockingScope: "ProductionTelemetry" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
      gateResult: "Pending" as const,
    }),
    Object.freeze({
      issueId: "SystemOfRecordSelection" as const,
      description: "System-of-record selection" as const,
      owner: "RTC Journal Operations" as const,
      status: "Unresolved" as const,
      blockingScope: "SystemOfRecordSelection" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "RealRtc2ConsumerAuthorization" as const,
      description: "Real RTC-2 consumer authorization" as const,
      owner: "Nexora Product and Architecture Authority" as const,
      status: "Unresolved" as const,
      blockingScope: "RealRtc2Consumption" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "ProductionProviderAndAdapter" as const,
      description: "Production provider and adapter" as const,
      owner: "EX-2 Product Boundary / RTC Journal Operations" as const,
      status: "Unresolved" as const,
      blockingScope: "ProductionProviderAdapter" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "ProductionPrivacyLegalAuthorityReviews" as const,
      description: "Production privacy, legal and authority reviews" as const,
      owner: "Privacy / Legal / Security / Executive Governance" as const,
      status: "Unresolved" as const,
      blockingScope: "ProductionPrivacyLegalAuthority" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "CloudPlatformAndRegion" as const,
      description: "Cloud platform and region" as const,
      owner: "Infrastructure / Architecture Authority" as const,
      status: "Unresolved" as const,
      blockingScope: "CloudPlatformRegion" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "KmsAndKeyCustody" as const,
      description: "KMS and key custody" as const,
      owner: "Security / Infrastructure" as const,
      status: "Unresolved" as const,
      blockingScope: "KmsKeyCustody" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "RpoRtoAndRecoveryOwnership" as const,
      description: "RPO/RTO and recovery ownership" as const,
      owner: "RTC Journal Operations" as const,
      status: "Unresolved" as const,
      blockingScope: "RecoveryOwnership" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "RouteAndNavigationAuthorization" as const,
      description: "Route and navigation authorization" as const,
      owner: "Nexora Product and Architecture Authority" as const,
      status: "Unresolved" as const,
      blockingScope: "RouteNavigation" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "PublicIndexPublication" as const,
      description: "Public Index publication" as const,
      owner: "EX Product Architecture" as const,
      status: "Unresolved" as const,
      blockingScope: "PublicIndexPublication" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
    Object.freeze({
      issueId: "DeploymentAuthorization" as const,
      description: "Deployment authorization" as const,
      owner: "Nexora Product and Architecture Authority" as const,
      status: "Unresolved" as const,
      blockingScope: "Deployment" as const,
      blocksFoundationReadiness: false,
      blocksProductionReadiness: true,
      carriedByPhase: "EX-2:1" as const,
    }),
  ]);

export const ExecutiveJournalExperienceOpenIssueIds = Object.freeze(
  ExecutiveJournalExperienceOpenIssues.map((item) => item.issueId),
);

export const getExecutiveJournalExperienceOpenIssue = (issueId: string) => {
  const found = ExecutiveJournalExperienceOpenIssues.find(
    (item) => item.issueId === issueId,
  );
  if (!found) {
    throw new Error(
      `Unknown EX-2:1 open issue fails closed: ${JSON.stringify(issueId)}`,
    );
  }
  return found;
};

export const ExecutiveJournalExperienceOpenIssueCatalogue = Object.freeze({
  issues: ExecutiveJournalExperienceOpenIssues,
  issueIds: ExecutiveJournalExperienceOpenIssueIds,
  pendingGates: ExecutiveJournalExperiencePendingGates,
  pendingGateIds: ExecutiveJournalExperiencePendingGateIds,
  architectureGateCatalogue: ExecutiveJournalProductArchitectureGates,
  getIssue: getExecutiveJournalExperienceOpenIssue,
  foundationReadinessBlockedByAnyOpenIssue: false as const,
  productionReadinessBlockedByOpenIssues: true as const,
  anyIssueResolvedByAssumption: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
