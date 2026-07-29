/**
 * EX-2:1 — Executive Journal Experience Foundation Types.
 *
 * Closed vocabularies and readonly contracts for the EX-2 experience
 * Foundation. Metadata-only. No UI. No runtime. No RTC-2 consumption.
 *
 * Ownership: owned exclusively by EX-2:1.
 */

/** Foundation status. */
export type ExecutiveJournalExperienceFoundationStatus = "Foundation";

/** Immediate next-phase readiness. */
export type ExecutiveJournalExperienceFoundationReadiness = "ReadyForRegistry";

/** Canonical phase key. */
export type ExecutiveJournalExperienceFoundationPhase = "EX-2:1";

/** Foundation lifecycle states — ordered forward only. */
export type ExecutiveJournalExperienceFoundationLifecycleState =
  | "Declared"
  | "Bounded"
  | "EvidenceLinked"
  | "ReadyForRegistry";

/** Closed boundary identifiers. */
export type ExecutiveJournalExperienceBoundaryId =
  | "ExperienceOwnership"
  | "GovernanceAuthority"
  | "MetadataOnly"
  | "ReadOnly"
  | "NoSystemOfRecord"
  | "NoAuthorityCreation"
  | "NoMutation"
  | "NoPrivateReflectionExposure"
  | "NoEvidencePayload"
  | "NoActorPii"
  | "NoNetwork"
  | "NoPersistence"
  | "NoTelemetry"
  | "NoRoute"
  | "NoProduction"
  | "NoDeployment"
  | "NoApp8Integration"
  | "NoRtc3Integration"
  | "NoPublicIndexPublication";

/** Evidence classification for Tier-0 and architecture references. */
export type ExecutiveJournalExperienceEvidenceClassification =
  | "SupportingEvidence"
  | "ArchitectureDecision"
  | "GovernanceDecision"
  | "PendingGate"
  | "OpenIssue";

/** Open-issue status vocabulary. */
export type ExecutiveJournalExperienceOpenIssueStatus = "Unresolved";

/** Pending-gate result vocabulary preserved from architecture. */
export type ExecutiveJournalExperiencePendingGateResult = "Pending";

/** Blocking scope for open issues. */
export type ExecutiveJournalExperienceBlockingScope =
  | "ProductionProviderCompatibility"
  | "ProductionAllowlist"
  | "ProductionTelemetry"
  | "SystemOfRecordSelection"
  | "RealRtc2Consumption"
  | "ProductionProviderAdapter"
  | "ProductionPrivacyLegalAuthority"
  | "CloudPlatformRegion"
  | "KmsKeyCustody"
  | "RecoveryOwnership"
  | "RouteNavigation"
  | "PublicIndexPublication"
  | "Deployment";

export interface ExecutiveJournalExperienceEvidenceDescriptor {
  readonly evidenceId: string;
  readonly classification: ExecutiveJournalExperienceEvidenceClassification;
  readonly productionApplicability: false;
  readonly satisfiesFormalEx2PhaseAutomatically: false;
  readonly label: "SupportingEvidence" | "ArchitectureAuthority";
  readonly sourcePhase: "EX-2:T0" | "EX-2 Architecture" | "EX-2:1";
  readonly notes: string;
}

export interface ExecutiveJournalExperienceOpenIssueDescriptor {
  readonly issueId: string;
  readonly description: string;
  readonly owner: string;
  readonly status: ExecutiveJournalExperienceOpenIssueStatus;
  readonly blockingScope: ExecutiveJournalExperienceBlockingScope;
  readonly blocksFoundationReadiness: boolean;
  readonly blocksProductionReadiness: boolean;
  readonly carriedByPhase: "EX-2:1";
  readonly gateResult?: ExecutiveJournalExperiencePendingGateResult;
}

export interface ExecutiveJournalExperienceFoundationSummary {
  readonly identity: "EX-2:1/ExecutiveJournalExperienceFoundation";
  readonly namespace: "nexora.ex.executive.journal.experience.foundation";
  readonly status: "Foundation";
  readonly readiness: "ReadyForRegistry";
  readonly metadataOnly: true;
  readonly sideEffectFree: true;
  readonly phase: "EX-2:1";
  readonly nextPhase: "EX-2:2 — Executive Journal Experience Registry";
  readonly decisionIds: readonly string[];
  readonly evidenceIds: readonly string[];
  readonly openIssueIds: readonly string[];
  readonly pendingGateIds: readonly ["G-EX2-04", "G-EX2-07", "G-EX2-12"];
  readonly productionAuthorized: false;
  readonly routeAuthorized: false;
  readonly deploymentAuthorized: false;
  readonly realRtc2ConsumptionAuthorized: false;
  readonly publicIndexAuthorized: false;
  readonly ex22Created: false;
  readonly ex22Authorized: false;
  readonly principleCount: number;
  readonly boundaryCount: number;
  readonly lifecycleState: "ReadyForRegistry";
  readonly authorizingDecisionId: "AD-EX2-08";
}
