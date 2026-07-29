/**
 * EX-2 Tier-0 Synthetic Read-Only UI Facade.
 *
 * Narrow facade over the certified synthetic metadata package public surface.
 * Emits safe immutable UI models only. No React.
 *
 * Authorized by EX2-UI-AUTH-T0-2026-07-27-01.
 */

import {
  createExecutiveJournalSyntheticMetadataProvider,
  createExecutiveJournalSyntheticLoadingView,
  mapProviderGetResultToViewContract,
  mapProviderListResultToViewContract,
  type ExecutiveJournalSyntheticMetadataProjection,
  type ExecutiveJournalSyntheticProviderMode,
  type ExecutiveJournalSyntheticViewContract,
} from "./executiveJournalSyntheticMetadata.ts";
import {
  assertExecutiveJournalSyntheticReadOnlyUiFacadeId,
  ExecutiveJournalSyntheticReadOnlyUiFacadeId,
  ExecutiveJournalSyntheticReadOnlyUiFacadeNamespace,
  ExecutiveJournalSyntheticUiAuthorityLabels,
  ExecutiveJournalSyntheticUiIntegrityLabels,
  ExecutiveJournalSyntheticUiMarkerScreenReader,
  ExecutiveJournalSyntheticUiMarkerVisible,
  ExecutiveJournalSyntheticUiOriginLabels,
  ExecutiveJournalSyntheticUiProductId,
  ExecutiveJournalSyntheticUiProductName,
  ExecutiveJournalSyntheticUiReadiness,
  ExecutiveJournalSyntheticUiStateCopy,
  ExecutiveJournalSyntheticUiStatus,
  ExecutiveJournalSyntheticUiSubtitle,
  ExecutiveJournalSyntheticPreviewUiId,
  type ExecutiveJournalSyntheticUiCategoryFilter,
  type ExecutiveJournalSyntheticUiLifecycleFilter,
  type ExecutiveJournalSyntheticUiRecord,
  type ExecutiveJournalSyntheticUiView,
  type ExecutiveJournalSyntheticUiViewState,
} from "./executiveJournalSyntheticUiTypes.ts";

const DISPLAY_KEYS = Object.freeze([
  "entry_category",
  "lifecycle_state",
  "origin_classification",
  "authority_state",
  "integrity_state",
  "source_classification",
] as const);

const CONDITIONAL_KEYS = Object.freeze([
  "journal_ref",
  "provenance_ref",
  "correction_ref",
  "supersession_ref",
  "projection_schema_version",
] as const);

const DENIED_FIELD_NAMES = Object.freeze([
  "evidence_present",
  "evidence_content",
  "private_reflection_content",
  "private_reflection_identity",
  "private_reflection_timestamp",
  "private_reflection_count",
  "private_reflection_existence",
  "actor_pii",
  "journal_body",
  "narrative",
  "rationale",
  "canonical_sequence_position",
  "shareable_entry_category",
  "projection_version",
] as const);

const ORIGIN_KEYS = Object.freeze(
  Object.keys(ExecutiveJournalSyntheticUiOriginLabels),
);
const AUTHORITY_KEYS = Object.freeze(
  Object.keys(ExecutiveJournalSyntheticUiAuthorityLabels),
);
const INTEGRITY_KEYS = Object.freeze(
  Object.keys(ExecutiveJournalSyntheticUiIntegrityLabels),
);

const markerFields = () =>
  Object.freeze({
    markerVisible: ExecutiveJournalSyntheticUiMarkerVisible,
    markerScreenReader: ExecutiveJournalSyntheticUiMarkerScreenReader,
  });

const isPlainObject = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasDeniedOrUnknownField = (
  source: Record<string, unknown>,
): boolean => {
  const allowed = new Set<string>([
    "entry_ref",
    ...DISPLAY_KEYS,
    ...CONDITIONAL_KEYS,
  ]);
  for (const key of Object.keys(source)) {
    if ((DENIED_FIELD_NAMES as readonly string[]).includes(key)) {
      return true;
    }
    if (!allowed.has(key)) {
      return true;
    }
  }
  return false;
};

const labelOrigin = (value: string): string => {
  if ((ORIGIN_KEYS as readonly string[]).includes(value)) {
    return ExecutiveJournalSyntheticUiOriginLabels[
      value as keyof typeof ExecutiveJournalSyntheticUiOriginLabels
    ];
  }
  return "System-derived";
};

const labelAuthority = (value: string): string => {
  if ((AUTHORITY_KEYS as readonly string[]).includes(value)) {
    return ExecutiveJournalSyntheticUiAuthorityLabels[
      value as keyof typeof ExecutiveJournalSyntheticUiAuthorityLabels
    ];
  }
  return "Authority unavailable";
};

const labelIntegrity = (value: string): string => {
  if ((INTEGRITY_KEYS as readonly string[]).includes(value)) {
    return ExecutiveJournalSyntheticUiIntegrityLabels[
      value as keyof typeof ExecutiveJournalSyntheticUiIntegrityLabels
    ];
  }
  return "Integrity unavailable";
};

/**
 * Maps an already-adapted certified projection into a safe UI record.
 * Rejects denied/unknown fields by returning null (caller maps to Failure).
 */
export const mapProjectionToUiRecord = (
  projection: ExecutiveJournalSyntheticMetadataProjection,
): ExecutiveJournalSyntheticUiRecord | null => {
  if (!isPlainObject(projection)) {
    return null;
  }
  const source = projection as unknown as Record<string, unknown>;
  if (hasDeniedOrUnknownField(source)) {
    return null;
  }
  if (typeof source.entry_ref !== "string" || source.entry_ref.length === 0) {
    return null;
  }
  for (const key of DISPLAY_KEYS) {
    if (typeof source[key] !== "string" || (source[key] as string).length === 0) {
      return null;
    }
  }

  const conditional: {
    journal_ref?: string;
    provenance_ref?: string;
    correction_ref?: string;
    supersession_ref?: string;
    projection_schema_version?: string;
  } = {};
  for (const key of CONDITIONAL_KEYS) {
    const value = source[key];
    if (typeof value === "string" && value.length > 0) {
      conditional[key] = value;
    }
  }

  return Object.freeze({
    selectionKey: source.entry_ref as string,
    display: Object.freeze({
      entry_category: source.entry_category as string,
      lifecycle_state: source.lifecycle_state as string,
      origin_classification: source.origin_classification as string,
      authority_state: source.authority_state as string,
      integrity_state: source.integrity_state as string,
      source_classification: source.source_classification as string,
    }),
    conditional: Object.freeze({ ...conditional }),
    labels: Object.freeze({
      origin: labelOrigin(source.origin_classification as string),
      authority: labelAuthority(source.authority_state as string),
      integrity: labelIntegrity(source.integrity_state as string),
      lifecycle: source.lifecycle_state as string,
      category: source.entry_category as string,
    }),
  });
};

const mapContractToUiView = (
  contract: ExecutiveJournalSyntheticViewContract,
): ExecutiveJournalSyntheticUiView => {
  switch (contract.state) {
    case "Loading":
      return Object.freeze({
        state: "Loading" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.Loading,
      });
    case "Ready": {
      const records: ExecutiveJournalSyntheticUiRecord[] = [];
      for (const projection of contract.projections) {
        const mapped = mapProjectionToUiRecord(projection);
        if (!mapped) {
          return Object.freeze({
            state: "Failure" as const,
            ...markerFields(),
            message: ExecutiveJournalSyntheticUiStateCopy.Failure,
          });
        }
        records.push(mapped);
      }
      return Object.freeze({
        state: "Ready" as const,
        ...markerFields(),
        records: Object.freeze(records),
      });
    }
    case "Empty":
      return Object.freeze({
        state: "Empty" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.Empty,
      });
    case "NotFound":
      return Object.freeze({
        state: "NotFound" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.NotFound,
      });
    case "PrivacyRejected":
      // Coarse safe message only — adapter rejection codes never escape.
      return Object.freeze({
        state: "PrivacyRejected" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.PrivacyRejected,
      });
    case "UnsupportedVersion":
      return Object.freeze({
        state: "UnsupportedVersion" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.UnsupportedVersion,
      });
    case "IntegrityUnavailable": {
      const record = mapProjectionToUiRecord(contract.projection);
      return Object.freeze({
        state: "IntegrityUnavailable" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.IntegrityUnavailable,
        record,
      });
    }
    case "ProviderUnavailable":
      return Object.freeze({
        state: "ProviderUnavailable" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.ProviderUnavailable,
      });
    case "Failure":
      return Object.freeze({
        state: "Failure" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.Failure,
      });
    default: {
      const _exhaustive: never = contract;
      return _exhaustive;
    }
  }
};

/**
 * Loads a safe UI view from the certified package via the public provider API.
 * Provider/fixture objects never leave this facade as raw exports.
 */
export const loadExecutiveJournalSyntheticUiView = (
  mode: ExecutiveJournalSyntheticProviderMode = "Normal",
): ExecutiveJournalSyntheticUiView => {
  try {
    const provider = createExecutiveJournalSyntheticMetadataProvider(mode);
    const listResult = provider.listSyntheticJournalMetadata();
    const contract = mapProviderListResultToViewContract(listResult);
    return mapContractToUiView(contract);
  } catch {
    return Object.freeze({
      state: "Failure" as const,
      ...markerFields(),
      message: ExecutiveJournalSyntheticUiStateCopy.Failure,
    });
  }
};

/**
 * Resolves a single synthetic record by selection key through the certified
 * provider public API, mapping to a safe UI view state.
 */
export const loadExecutiveJournalSyntheticUiRecordView = (
  selectionKey: string,
  mode: ExecutiveJournalSyntheticProviderMode = "Normal",
): ExecutiveJournalSyntheticUiView => {
  try {
    const provider = createExecutiveJournalSyntheticMetadataProvider(mode);
    const getResult = provider.getSyntheticJournalMetadataByRef(selectionKey);
    const contract = mapProviderGetResultToViewContract(getResult);
    return mapContractToUiView(contract);
  } catch {
    return Object.freeze({
      state: "Failure" as const,
      ...markerFields(),
      message: ExecutiveJournalSyntheticUiStateCopy.Failure,
    });
  }
};

/** Deterministic loading view without invoking the provider. */
export const createExecutiveJournalSyntheticUiLoadingView =
  (): ExecutiveJournalSyntheticUiView => {
    const contract = createExecutiveJournalSyntheticLoadingView();
    return mapContractToUiView(contract);
  };

/**
 * Development/test harness factory for each of the nine UI states.
 * Uses only facade-safe models — no raw fixtures escape.
 */
export const createExecutiveJournalSyntheticUiDemoView = (
  state: ExecutiveJournalSyntheticUiViewState,
): ExecutiveJournalSyntheticUiView => {
  switch (state) {
    case "Loading":
      return createExecutiveJournalSyntheticUiLoadingView();
    case "Ready":
      return loadExecutiveJournalSyntheticUiView("Normal");
    case "Empty":
      return loadExecutiveJournalSyntheticUiView("Empty");
    case "NotFound":
      return Object.freeze({
        state: "NotFound" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.NotFound,
      });
    case "PrivacyRejected":
      return loadExecutiveJournalSyntheticUiView("Denied");
    case "UnsupportedVersion":
      return loadExecutiveJournalSyntheticUiView("Stale");
    case "IntegrityUnavailable": {
      const ready = loadExecutiveJournalSyntheticUiView("Normal");
      if (ready.state !== "Ready") {
        return Object.freeze({
          state: "IntegrityUnavailable" as const,
          ...markerFields(),
          message: ExecutiveJournalSyntheticUiStateCopy.IntegrityUnavailable,
          record: null,
        });
      }
      const unavailable = ready.records.find(
        (item) => item.display.integrity_state === "Unavailable",
      );
      return Object.freeze({
        state: "IntegrityUnavailable" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.IntegrityUnavailable,
        record: unavailable ?? null,
      });
    }
    case "ProviderUnavailable":
      return loadExecutiveJournalSyntheticUiView("Unavailable");
    case "Failure":
      return Object.freeze({
        state: "Failure" as const,
        ...markerFields(),
        message: ExecutiveJournalSyntheticUiStateCopy.Failure,
      });
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
};

/**
 * Pure in-memory filter. Preserves input order. Exposes no counts.
 * Does not mutate the source array or records.
 */
export const filterExecutiveJournalSyntheticUiRecords = (
  records: readonly ExecutiveJournalSyntheticUiRecord[],
  category: ExecutiveJournalSyntheticUiCategoryFilter,
  lifecycle: ExecutiveJournalSyntheticUiLifecycleFilter,
): readonly ExecutiveJournalSyntheticUiRecord[] =>
  Object.freeze(
    records.filter((item) => {
      const categoryOk =
        category === "All" || item.display.entry_category === category;
      const lifecycleOk =
        lifecycle === "All" || item.display.lifecycle_state === lifecycle;
      return categoryOk && lifecycleOk;
    }),
  );

export const selectExecutiveJournalSyntheticUiRecord = (
  records: readonly ExecutiveJournalSyntheticUiRecord[],
  selectionKey: string | null,
): ExecutiveJournalSyntheticUiRecord | null => {
  if (selectionKey === null) {
    return null;
  }
  return records.find((item) => item.selectionKey === selectionKey) ?? null;
};

export const ExecutiveJournalSyntheticReadOnlyUiFacade = Object.freeze({
  facadeId: ExecutiveJournalSyntheticReadOnlyUiFacadeId,
  facadeNamespace: ExecutiveJournalSyntheticReadOnlyUiFacadeNamespace,
  productId: ExecutiveJournalSyntheticUiProductId,
  uiId: ExecutiveJournalSyntheticPreviewUiId,
  productName: ExecutiveJournalSyntheticUiProductName,
  subtitle: ExecutiveJournalSyntheticUiSubtitle,
  status: ExecutiveJournalSyntheticUiStatus,
  readiness: ExecutiveJournalSyntheticUiReadiness,
  authorizationId: "EX2-UI-AUTH-T0-2026-07-27-01" as const,
  metadataCertificationId: "EX2-CERT-T0-2026-07-26-01" as const,
  uiCertificationId: "EX2-UI-CERT-T0-2026-07-27-01" as const,
  certificationId: "EX2-UI-CERT-T0-2026-07-27-01" as const,
  rawFixturesExposed: false as const,
  providerInternalsExposed: false as const,
  adapterInternalsExposed: false as const,
  preAdapterProjectionsExposed: false as const,
  mutationOperationsExposed: false as const,
  networkFallback: false as const,
  persistenceFallback: false as const,
  react: false as const,
  loadView: loadExecutiveJournalSyntheticUiView,
  loadRecordView: loadExecutiveJournalSyntheticUiRecordView,
  createLoadingView: createExecutiveJournalSyntheticUiLoadingView,
  createDemoView: createExecutiveJournalSyntheticUiDemoView,
  filterRecords: filterExecutiveJournalSyntheticUiRecords,
  selectRecord: selectExecutiveJournalSyntheticUiRecord,
  mapProjectionToUiRecord,
  assertFacadeId: assertExecutiveJournalSyntheticReadOnlyUiFacadeId,
  implemented: true as const,
  metadataOnly: false as const,
  immutable: true as const,
  deterministic: true as const,
  sideEffectFree: true as const,
});

export type ExecutiveJournalSyntheticReadOnlyUiFacadeType =
  typeof ExecutiveJournalSyntheticReadOnlyUiFacade;
