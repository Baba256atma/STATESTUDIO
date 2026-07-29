/**
 * EX-2 Tier-0 Synthetic UI — closed vocabularies and safe view models.
 *
 * Presentation contracts only. No React, networking, or persistence.
 * Authorized by EX2-UI-AUTH-T0-2026-07-27-01.
 */

export const ExecutiveJournalSyntheticUiProductId =
  "EX-2:T0/ExecutiveJournalSyntheticContractPreview" as const;

export const ExecutiveJournalSyntheticPreviewUiId =
  "EX-2:T0/ExecutiveJournalSyntheticPreviewUI" as const;

export const ExecutiveJournalSyntheticPreviewUiNamespace =
  "nexora.ex.executive.journal.synthetic.preview.ui" as const;

export const ExecutiveJournalSyntheticReadOnlyUiFacadeId =
  "EX-2:T0/ExecutiveJournalSyntheticReadOnlyUiFacade" as const;

export const ExecutiveJournalSyntheticReadOnlyUiFacadeNamespace =
  "nexora.ex.executive.journal.synthetic.readonly.ui.facade" as const;

export const ExecutiveJournalSyntheticUiProductName =
  "Executive Journal Synthetic Contract Preview (Tier 0)" as const;

export const ExecutiveJournalSyntheticUiSubtitle =
  "Non-production · No live journal data · Reviewers only" as const;

export const ExecutiveJournalSyntheticUiStatus =
  "CertifiedTier0SyntheticUi" as const;

export const ExecutiveJournalSyntheticUiReadiness =
  "ReadyForTier0SyntheticDevelopmentHarnessUse" as const;

export const ExecutiveJournalSyntheticUiMarkerVisible =
  "Synthetic · Tier 0 · Non-production · No live journal data" as const;

export const ExecutiveJournalSyntheticUiMarkerScreenReader =
  "Synthetic Tier 0 non-production preview. No live journal data." as const;

export const ExecutiveJournalSyntheticUiViewStates = Object.freeze([
  "Loading",
  "Ready",
  "Empty",
  "NotFound",
  "PrivacyRejected",
  "UnsupportedVersion",
  "IntegrityUnavailable",
  "ProviderUnavailable",
  "Failure",
] as const);

export type ExecutiveJournalSyntheticUiViewState =
  (typeof ExecutiveJournalSyntheticUiViewStates)[number];

export const ExecutiveJournalSyntheticUiCategoryFilters = Object.freeze([
  "All",
  "Commitment",
  "Risk",
  "Exception",
  "Outcome",
  "Control",
  "General",
] as const);

export type ExecutiveJournalSyntheticUiCategoryFilter =
  (typeof ExecutiveJournalSyntheticUiCategoryFilters)[number];

export const ExecutiveJournalSyntheticUiLifecycleFilters = Object.freeze([
  "All",
  "Proposed",
  "Accepted",
  "Disputed",
  "Superseded",
  "Closed",
  "Disposed",
] as const);

export type ExecutiveJournalSyntheticUiLifecycleFilter =
  (typeof ExecutiveJournalSyntheticUiLifecycleFilters)[number];

export const ExecutiveJournalSyntheticUiDisplayFields = Object.freeze([
  "entry_category",
  "lifecycle_state",
  "origin_classification",
  "authority_state",
  "integrity_state",
  "source_classification",
] as const);

export const ExecutiveJournalSyntheticUiConditionalDisplayFields = Object.freeze([
  "journal_ref",
  "provenance_ref",
  "correction_ref",
  "supersession_ref",
  "projection_schema_version",
] as const);

export const ExecutiveJournalSyntheticUiInternalOnlyFields = Object.freeze([
  "entry_ref",
] as const);

export const ExecutiveJournalSyntheticUiStateCopy = Object.freeze({
  Loading: "Loading synthetic preview",
  Empty: "No synthetic records are available for this preview.",
  NotFound: "The selected synthetic record is not available.",
  PrivacyRejected:
    "This preview was blocked by the synthetic privacy boundary.",
  UnsupportedVersion: "This synthetic preview version is not supported.",
  IntegrityUnavailable: "Synthetic integrity information is unavailable.",
  ProviderUnavailable: "The synthetic preview source is unavailable.",
  Failure: "The synthetic preview failed safely.",
  ReadyEmptyFilter: "No synthetic records match the selected filters.",
} as const);

export const ExecutiveJournalSyntheticUiOriginLabels = Object.freeze({
  HumanOrigin: "Human-origin",
  AiProposed: "AI-proposed — non-authoritative",
  SystemDerived: "System-derived",
} as const);

export const ExecutiveJournalSyntheticUiAuthorityLabels = Object.freeze({
  Present: "Authority present",
  Absent: "Authority absent",
  Unavailable: "Authority unavailable",
} as const);

export const ExecutiveJournalSyntheticUiIntegrityLabels = Object.freeze({
  Verified: "Integrity verified — synthetic",
  Failed: "Integrity failed — synthetic",
  Unavailable: "Integrity unavailable",
} as const);

/** Visible display fields for a safe UI record. */
export interface ExecutiveJournalSyntheticUiDisplayValues {
  readonly entry_category: string;
  readonly lifecycle_state: string;
  readonly origin_classification: string;
  readonly authority_state: string;
  readonly integrity_state: string;
  readonly source_classification: string;
}

/** Conditional opaque references — present only when non-null. */
export interface ExecutiveJournalSyntheticUiConditionalValues {
  readonly journal_ref?: string;
  readonly provenance_ref?: string;
  readonly correction_ref?: string;
  readonly supersession_ref?: string;
  readonly projection_schema_version?: string;
}

/**
 * Safe UI record. selectionKey is entry_ref for local selection only —
 * never rendered as the primary visible identity.
 */
export interface ExecutiveJournalSyntheticUiRecord {
  readonly selectionKey: string;
  readonly display: ExecutiveJournalSyntheticUiDisplayValues;
  readonly conditional: ExecutiveJournalSyntheticUiConditionalValues;
  readonly labels: {
    readonly origin: string;
    readonly authority: string;
    readonly integrity: string;
    readonly lifecycle: string;
    readonly category: string;
  };
}

export type ExecutiveJournalSyntheticUiView =
  | {
      readonly state: "Loading";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly message: typeof ExecutiveJournalSyntheticUiStateCopy.Loading;
    }
  | {
      readonly state: "Ready";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly records: readonly ExecutiveJournalSyntheticUiRecord[];
    }
  | {
      readonly state: "Empty";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly message: typeof ExecutiveJournalSyntheticUiStateCopy.Empty;
    }
  | {
      readonly state: "NotFound";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly message: typeof ExecutiveJournalSyntheticUiStateCopy.NotFound;
    }
  | {
      readonly state: "PrivacyRejected";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly message: typeof ExecutiveJournalSyntheticUiStateCopy.PrivacyRejected;
    }
  | {
      readonly state: "UnsupportedVersion";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly message: typeof ExecutiveJournalSyntheticUiStateCopy.UnsupportedVersion;
    }
  | {
      readonly state: "IntegrityUnavailable";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly message: typeof ExecutiveJournalSyntheticUiStateCopy.IntegrityUnavailable;
      readonly record: ExecutiveJournalSyntheticUiRecord | null;
    }
  | {
      readonly state: "ProviderUnavailable";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly message: typeof ExecutiveJournalSyntheticUiStateCopy.ProviderUnavailable;
    }
  | {
      readonly state: "Failure";
      readonly markerVisible: typeof ExecutiveJournalSyntheticUiMarkerVisible;
      readonly markerScreenReader: typeof ExecutiveJournalSyntheticUiMarkerScreenReader;
      readonly message: typeof ExecutiveJournalSyntheticUiStateCopy.Failure;
    };

export interface ExecutiveJournalSyntheticUiLocalFilters {
  readonly category: ExecutiveJournalSyntheticUiCategoryFilter;
  readonly lifecycle: ExecutiveJournalSyntheticUiLifecycleFilter;
}

export const assertExecutiveJournalSyntheticPreviewUiId = (
  value: string,
): typeof ExecutiveJournalSyntheticPreviewUiId => {
  if (value !== ExecutiveJournalSyntheticPreviewUiId) {
    throw new Error(
      `Unknown EX-2 Tier-0 synthetic preview UI ID fails closed: ${JSON.stringify(value)}`,
    );
  }
  return ExecutiveJournalSyntheticPreviewUiId;
};

export const assertExecutiveJournalSyntheticReadOnlyUiFacadeId = (
  value: string,
): typeof ExecutiveJournalSyntheticReadOnlyUiFacadeId => {
  if (value !== ExecutiveJournalSyntheticReadOnlyUiFacadeId) {
    throw new Error(
      `Unknown EX-2 Tier-0 synthetic UI facade ID fails closed: ${JSON.stringify(value)}`,
    );
  }
  return ExecutiveJournalSyntheticReadOnlyUiFacadeId;
};

export const assertExecutiveJournalSyntheticUiViewState = (
  value: string,
): ExecutiveJournalSyntheticUiViewState => {
  if (
    !(ExecutiveJournalSyntheticUiViewStates as readonly string[]).includes(value)
  ) {
    throw new Error(
      `Unknown EX-2 Tier-0 synthetic UI view state fails closed: ${JSON.stringify(value)}`,
    );
  }
  return value as ExecutiveJournalSyntheticUiViewState;
};
