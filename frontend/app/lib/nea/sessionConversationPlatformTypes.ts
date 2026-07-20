/**
 * NEA-3:6 — Session & Conversation Platform Types.
 *
 * Readonly contracts for the Session & Conversation Platform composition surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:6.
 */

/** Platform status for NEA-3:6. */
export type SessionConversationPlatformStatus = "Platform";

/** Immediate downstream readiness — Certification only. */
export type SessionConversationPlatformReadiness = "ReadyForCertification";

/** Platform namespace section keys. */
export type SessionConversationPlatformNamespaceSection =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform";

/** Canonical phase composition entry by reference. */
export interface SessionConversationPlatformPhaseComposition {
  readonly section: SessionConversationPlatformNamespaceSection;
  readonly phaseId: string;
  readonly phaseName: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: string;
  readonly module: string;
  readonly ownership: "Referenced";
  readonly reconstructsPhase: false;
  readonly duplicatesArchitecture: false;
  readonly deterministicOrder: number;
}

/** Canonical platform identity. */
export interface SessionConversationPlatformIdentity {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformVersion: string;
  readonly platformNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:6";
  readonly stage: "Platform";
  readonly sourcePhase: "NEA-3:6";
  readonly owner: string;
  readonly status: SessionConversationPlatformStatus;
  readonly readiness: SessionConversationPlatformReadiness;
  readonly manifestId: string;
  readonly manifestVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic platform summary. */
export interface SessionConversationPlatformSummary {
  readonly platformId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:6";
  readonly status: SessionConversationPlatformStatus;
  readonly readiness: SessionConversationPlatformReadiness;
  readonly manifestId: string;
  readonly composedPhaseCount: number;
  readonly namespaceSectionCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly architectureStatus: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
