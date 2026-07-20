/**
 * NEA-3:5 — Session & Conversation Manifest Types.
 *
 * Readonly contracts for the Session & Conversation Manifest publication layer.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-3:5.
 */

/** Manifest status for NEA-3:5. */
export type SessionConversationManifestStatus = "Manifest";

/** Immediate downstream readiness — Platform only. */
export type SessionConversationManifestReadiness = "ReadyForPlatform";

/** Canonical phase reference entry. */
export interface SessionConversationManifestPhaseReference {
  readonly phaseId: string;
  readonly phaseName: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: string;
  readonly module: string;
  readonly ownership: "Referenced";
  readonly reconstructsPhase: false;
  readonly duplicatesInventory: false;
  readonly deterministicOrder: number;
}

/** Derived inventory count entry. */
export interface SessionConversationManifestInventoryEntry {
  readonly inventoryKey: string;
  readonly label: string;
  readonly count: number;
  readonly sourcePhase: "NEA-3:1" | "NEA-3:2" | "NEA-3:3" | "NEA-3:4";
  readonly ownership: "Referenced";
  readonly hardcoded: false;
  readonly reconstructed: false;
  readonly deterministicOrder: number;
}

/** Canonical manifest identity. */
export interface SessionConversationManifestIdentity {
  readonly manifestId: string;
  readonly manifestName: string;
  readonly manifestVersion: string;
  readonly manifestNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:5";
  readonly stage: "Manifest";
  readonly sourcePhase: "NEA-3:5";
  readonly owner: string;
  readonly status: SessionConversationManifestStatus;
  readonly readiness: SessionConversationManifestReadiness;
  readonly validationId: string;
  readonly validationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic manifest summary. */
export interface SessionConversationManifestSummary {
  readonly manifestId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:5";
  readonly status: SessionConversationManifestStatus;
  readonly readiness: SessionConversationManifestReadiness;
  readonly validationId: string;
  readonly phaseReferenceCount: number;
  readonly inventoryEntryCount: number;
  readonly totalArchitectureCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
