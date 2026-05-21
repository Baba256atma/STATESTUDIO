import { stableSignature } from "../intelligence/shared/dedupe";
import {
  INSTITUTIONAL_ALIGNMENT_MAX_ALIGNMENTS,
  INSTITUTIONAL_ALIGNMENT_MAX_FIELDS,
  INSTITUTIONAL_ALIGNMENT_MAX_INDICATORS,
  INSTITUTIONAL_ALIGNMENT_MAX_SIGNALS,
  INSTITUTIONAL_ALIGNMENT_MAX_SNAPSHOTS,
} from "./institutionalAlignmentGuards";
import type {
  EnterprisePolicyAlignment,
  GovernanceCoherenceSnapshot,
  InstitutionalAlignmentSignal,
  InstitutionalAlignmentStoreState,
  OrganizationalIntegrityField,
  StrategicConsistencyIndicator,
} from "./institutionalAlignmentTypes";

function mergeAlignments(
  existing: EnterprisePolicyAlignment,
  incoming: EnterprisePolicyAlignment
): EnterprisePolicyAlignment {
  return {
    ...existing,
    summary: incoming.summary || existing.summary,
    alignmentSignals: Object.freeze(
      Array.from(new Set([...existing.alignmentSignals, ...incoming.alignmentSignals])).slice(0, 6)
    ),
    coherenceRisks: Object.freeze(
      Array.from(new Set([...existing.coherenceRisks, ...incoming.coherenceRisks])).slice(0, 6)
    ),
    confidence: Math.max(existing.confidence, incoming.confidence),
    coherenceState:
      incoming.confidence >= existing.confidence
        ? incoming.coherenceState
        : existing.coherenceState,
    alignmentStrength:
      incoming.confidence >= existing.confidence
        ? incoming.alignmentStrength
        : existing.alignmentStrength,
    alignmentCategory:
      incoming.confidence >= existing.confidence
        ? incoming.alignmentCategory
        : existing.alignmentCategory,
    lastObservedAt: Math.max(existing.lastObservedAt, incoming.lastObservedAt),
    occurrenceCount: existing.occurrenceCount + (incoming.occurrenceCount || 1),
  };
}

function buildStoreSignature(state: {
  policyAlignments: readonly EnterprisePolicyAlignment[];
}): string {
  return stableSignature([
    "d9-5-7-institutional-alignment",
    state.policyAlignments.length,
    state.policyAlignments.slice(0, 3).map((a) => a.alignmentId),
  ]);
}

export function createInstitutionalAlignmentStore(initial?: InstitutionalAlignmentStoreState): {
  getState(): InstitutionalAlignmentStoreState;
  upsertPolicyAlignments(
    alignments: EnterprisePolicyAlignment[],
    now?: number
  ): InstitutionalAlignmentStoreState;
  upsertSnapshots(
    snapshots: GovernanceCoherenceSnapshot[],
    now?: number
  ): InstitutionalAlignmentStoreState;
  upsertAlignmentSignals(
    signals: InstitutionalAlignmentSignal[],
    now?: number
  ): InstitutionalAlignmentStoreState;
  upsertConsistencyIndicators(
    indicators: StrategicConsistencyIndicator[],
    now?: number
  ): InstitutionalAlignmentStoreState;
  upsertIntegrityFields(
    fields: OrganizationalIntegrityField[],
    now?: number
  ): InstitutionalAlignmentStoreState;
  setLastEvaluationSignature(signature: string): void;
  clear(): InstitutionalAlignmentStoreState;
} {
  let state: InstitutionalAlignmentStoreState = initial ?? {
    policyAlignments: [],
    snapshots: [],
    alignmentSignals: [],
    consistencyIndicators: [],
    integrityFields: [],
    signature: buildStoreSignature({ policyAlignments: [] }),
    updatedAt: 0,
    lastEvaluationSignature: null,
  };

  return {
    getState(): InstitutionalAlignmentStoreState {
      return {
        ...state,
        policyAlignments: state.policyAlignments.map((a) => ({ ...a })),
        snapshots: state.snapshots.map((s) => ({ ...s })),
        alignmentSignals: state.alignmentSignals.map((s) => ({ ...s })),
        consistencyIndicators: state.consistencyIndicators.map((i) => ({ ...i })),
        integrityFields: state.integrityFields.map((f) => ({ ...f })),
      };
    },

    upsertPolicyAlignments(
      alignments: EnterprisePolicyAlignment[],
      now = Date.now()
    ): InstitutionalAlignmentStoreState {
      const byId = new Map<string, EnterprisePolicyAlignment>();
      for (const a of state.policyAlignments) byId.set(a.alignmentId, a);
      for (const a of alignments) {
        const existing = byId.get(a.alignmentId);
        byId.set(a.alignmentId, existing ? mergeAlignments(existing, a) : { ...a });
      }
      const next = Array.from(byId.values())
        .sort((a, b) => b.lastObservedAt - a.lastObservedAt)
        .slice(0, INSTITUTIONAL_ALIGNMENT_MAX_ALIGNMENTS);
      state = {
        ...state,
        policyAlignments: Object.freeze(next),
        signature: buildStoreSignature({ policyAlignments: next }),
        updatedAt: now,
      };
      return this.getState();
    },

    upsertSnapshots(
      snapshots: GovernanceCoherenceSnapshot[],
      now = Date.now()
    ): InstitutionalAlignmentStoreState {
      const byId = new Map<string, GovernanceCoherenceSnapshot>();
      for (const s of state.snapshots) byId.set(s.signature, s);
      for (const s of snapshots) byId.set(s.signature, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_ALIGNMENT_MAX_SNAPSHOTS);
      state = { ...state, snapshots: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertAlignmentSignals(
      signals: InstitutionalAlignmentSignal[],
      now = Date.now()
    ): InstitutionalAlignmentStoreState {
      const byId = new Map<string, InstitutionalAlignmentSignal>();
      for (const s of state.alignmentSignals) byId.set(s.signalId, s);
      for (const s of signals) byId.set(s.signalId, s);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_ALIGNMENT_MAX_SIGNALS);
      state = { ...state, alignmentSignals: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertConsistencyIndicators(
      indicators: StrategicConsistencyIndicator[],
      now = Date.now()
    ): InstitutionalAlignmentStoreState {
      const byId = new Map<string, StrategicConsistencyIndicator>();
      for (const i of state.consistencyIndicators) byId.set(i.indicatorId, i);
      for (const i of indicators) byId.set(i.indicatorId, i);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_ALIGNMENT_MAX_INDICATORS);
      state = { ...state, consistencyIndicators: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    upsertIntegrityFields(
      fields: OrganizationalIntegrityField[],
      now = Date.now()
    ): InstitutionalAlignmentStoreState {
      const byId = new Map<string, OrganizationalIntegrityField>();
      for (const f of state.integrityFields) byId.set(f.fieldId, f);
      for (const f of fields) byId.set(f.fieldId, f);
      const next = Array.from(byId.values())
        .sort((a, b) => b.generatedAt - a.generatedAt)
        .slice(0, INSTITUTIONAL_ALIGNMENT_MAX_FIELDS);
      state = { ...state, integrityFields: Object.freeze(next), updatedAt: now };
      return this.getState();
    },

    setLastEvaluationSignature(signature: string): void {
      state = { ...state, lastEvaluationSignature: signature };
    },

    clear(): InstitutionalAlignmentStoreState {
      state = {
        policyAlignments: [],
        snapshots: [],
        alignmentSignals: [],
        consistencyIndicators: [],
        integrityFields: [],
        signature: buildStoreSignature({ policyAlignments: [] }),
        updatedAt: 0,
        lastEvaluationSignature: null,
      };
      return this.getState();
    },
  };
}

const storesByOrganization = new Map<
  string,
  ReturnType<typeof createInstitutionalAlignmentStore>
>();

export function getInstitutionalAlignmentStore(organizationId: string) {
  const key = organizationId.trim() || "nexora-default";
  let store = storesByOrganization.get(key);
  if (!store) {
    store = createInstitutionalAlignmentStore();
    storesByOrganization.set(key, store);
  }
  return store;
}

export function resetInstitutionalAlignmentStores(): void {
  storesByOrganization.clear();
}
