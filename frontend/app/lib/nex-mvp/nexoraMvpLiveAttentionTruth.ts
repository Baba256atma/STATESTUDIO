/**
 * NPA-T LIVE-ATTENTION-TRUTH:1 — effective management attention/status.
 *
 * Resolves catalog baseline + supported Data Reality Stage bindings into the
 * effective attention/status Overview, OVS, and other consumers read.
 * Does not own Watch ranking, KPI computation, or canonical identity.
 */

import type {
  DataRealityAdvisorMVPObjectResolutionStatus,
} from "@/app/lib/data-reality/dataRealityAdvisorMVPBridge.ts";
import type {
  DataRealityAwareStageBindingStatus,
  DataRealityAwareStageMvpAttention,
  DataRealityAwareStageMvpStatus,
  DataRealityAwareStageObjectBinding,
} from "@/app/lib/data-reality/dataRealityAwareStageExperienceBinding.ts";
import type { NexoraMVPStageObjectFixture } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";

export const nexoraMvpLiveAttentionTruthIdentity =
  "NPA-T/LIVE-ATTENTION-TRUTH:1" as const;

export const NEXORA_MVP_LIVE_ATTENTION_TRUTH_POLICY = Object.freeze({
  owner: "resolveNexoraMvpEffectiveManagementState" as const,
  secondStore: false as const,
  mutatesCanonicalBaseline: false as const,
  overlayProjection: true as const,
  stageOwnsTruth: false as const,
  overviewOwnsTruth: false as const,
  ovsOwnsTruth: false as const,
  nmiOwnsTruth: false as const,
  advisorOwnsTruth: false as const,
  llmWritesEffectiveState: false as const,
  providerTypeDeterminesMeaning: false as const,
  hardCodedObjectIds: false as const,
  labelHeuristics: false as const,
  missingEvidence: "retain-baseline" as const,
  unsupportedEvidence: "retain-baseline" as const,
  unboundSafetyOverwrite: false as const,
  coupledLiveVocabulary: true as const,
  conflictRule: "supported-evidence-identity-last" as const,
});

export const NEXORA_MVP_MANAGEMENT_ATTENTIONS = Object.freeze([
  "normal",
  "elevated",
  "important",
  "critical",
] as const);

export type NexoraMvpManagementAttention =
  (typeof NEXORA_MVP_MANAGEMENT_ATTENTIONS)[number];

export const NEXORA_MVP_MANAGEMENT_STATUSES = Object.freeze([
  "stable",
  "watch",
  "risk",
  "unresolved",
] as const);

export type NexoraMvpManagementStatus =
  (typeof NEXORA_MVP_MANAGEMENT_STATUSES)[number];

export type NexoraMvpManagementStateFields = {
  readonly attention: NexoraMvpManagementAttention;
  readonly status: NexoraMvpManagementStatus;
};

export type NexoraMvpEffectiveFieldSource =
  | "catalog-baseline"
  | "live-supported"
  | "live-withheld";

export type NexoraMvpLiveManagementEvidence = {
  readonly objectId: string;
  readonly bindingStatus?: DataRealityAwareStageBindingStatus;
  readonly resolutionStatus?: DataRealityAdvisorMVPObjectResolutionStatus;
  readonly mvpStatus?: DataRealityAwareStageMvpStatus;
  readonly mvpAttention?: DataRealityAwareStageMvpAttention;
  readonly evidenceIds?: readonly string[];
  readonly realityState?: string;
  readonly hasData?: boolean;
  readonly hasKPI?: boolean;
  readonly datasetId?: string;
};

export type NexoraMvpEffectiveManagementState = {
  readonly canonicalId: string;
  readonly baseline: NexoraMvpManagementStateFields;
  readonly live: NexoraMvpManagementStateFields | null;
  readonly effective: NexoraMvpManagementStateFields;
  readonly fieldSources: {
    readonly attention: NexoraMvpEffectiveFieldSource;
    readonly status: NexoraMvpEffectiveFieldSource;
  };
  readonly provenance: {
    readonly sourceClass:
      | "catalog-baseline"
      | "data-reality-supported"
      | "live-withheld";
    readonly bindingStatus: DataRealityAwareStageBindingStatus | "none";
    readonly evidenceIds: readonly string[];
    readonly realityState: string | null;
    readonly datasetId: string | null;
    readonly runtimeStateId: string | null;
  };
};

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function evidenceIdentity(entry: NexoraMvpLiveManagementEvidence): string {
  return `${entry.datasetId ?? ""}|${(entry.evidenceIds ?? []).join(",")}|${entry.objectId}`;
}

export function isSupportedLiveManagementEvidence(
  evidence: NexoraMvpLiveManagementEvidence | null | undefined,
): boolean {
  if (evidence == null) return false;
  if (
    evidence.bindingStatus === "unbound" ||
    evidence.bindingStatus === "unavailable"
  ) {
    return false;
  }
  if (evidence.resolutionStatus === "unavailable") return false;
  if (evidence.bindingStatus === "unresolved") {
    return evidence.mvpStatus != null || evidence.mvpAttention != null;
  }
  if (evidence.bindingStatus === "bound") {
    return evidence.mvpStatus != null || evidence.mvpAttention != null;
  }
  if (evidence.bindingStatus == null) {
    return evidence.mvpStatus != null || evidence.mvpAttention != null;
  }
  return false;
}

export function pickAuthoritativeLiveManagementEvidence(
  evidence: readonly NexoraMvpLiveManagementEvidence[],
): NexoraMvpLiveManagementEvidence | null {
  const supported = evidence.filter((entry) =>
    isSupportedLiveManagementEvidence(entry),
  );
  if (supported.length === 0) return null;
  const ranked = [...supported].sort((left, right) =>
    compareIds(evidenceIdentity(left), evidenceIdentity(right)),
  );
  return ranked[ranked.length - 1] ?? null;
}

function fieldSource(
  liveUsed: boolean,
  hadSupportedLive: boolean,
  hadEvidence: boolean,
): NexoraMvpEffectiveFieldSource {
  if (liveUsed) return "live-supported";
  if (hadSupportedLive) return "catalog-baseline";
  if (hadEvidence) return "live-withheld";
  return "catalog-baseline";
}

export function resolveNexoraMvpEffectiveManagementState(input: {
  readonly canonicalId: string;
  readonly baseline: NexoraMvpManagementStateFields;
  readonly evidence?: readonly NexoraMvpLiveManagementEvidence[];
  readonly runtimeStateId?: string | null;
}): NexoraMvpEffectiveManagementState {
  const rankedEvidence = [...(input.evidence ?? [])].sort((left, right) =>
    compareIds(evidenceIdentity(left), evidenceIdentity(right)),
  );
  const hadEvidence = rankedEvidence.length > 0;
  const live = pickAuthoritativeLiveManagementEvidence(rankedEvidence);
  const liveFields: NexoraMvpManagementStateFields | null =
    live == null
      ? null
      : Object.freeze({
          attention:
            live.mvpAttention ?? input.baseline.attention,
          status: live.mvpStatus ?? input.baseline.status,
        });

  const attentionLive =
    live != null && live.mvpAttention != null;
  const statusLive = live != null && live.mvpStatus != null;

  const effective = Object.freeze({
    attention: attentionLive
      ? (live!.mvpAttention as NexoraMvpManagementAttention)
      : input.baseline.attention,
    status: statusLive
      ? (live!.mvpStatus as NexoraMvpManagementStatus)
      : input.baseline.status,
  });

  const sourceClass =
    live != null && (attentionLive || statusLive)
      ? ("data-reality-supported" as const)
      : hadEvidence
        ? ("live-withheld" as const)
        : ("catalog-baseline" as const);

  return Object.freeze({
    canonicalId: input.canonicalId,
    baseline: Object.freeze({ ...input.baseline }),
    live: liveFields,
    effective,
    fieldSources: Object.freeze({
      attention: fieldSource(attentionLive, live != null, hadEvidence),
      status: fieldSource(statusLive, live != null, hadEvidence),
    }),
    provenance: Object.freeze({
      sourceClass,
      bindingStatus:
        live?.bindingStatus ??
        rankedEvidence[rankedEvidence.length - 1]?.bindingStatus ??
        "none",
      evidenceIds: Object.freeze([...(live?.evidenceIds ?? [])]),
      realityState: live?.realityState ?? null,
      datasetId: live?.datasetId ?? null,
      runtimeStateId: input.runtimeStateId ?? null,
    }),
  });
}

export function resolveNexoraMvpEffectiveManagementStates(input: {
  readonly baselineObjects: readonly Pick<
    NexoraMVPStageObjectFixture,
    "id" | "attention" | "status"
  >[];
  readonly bindings?: readonly Pick<
    DataRealityAwareStageObjectBinding,
    | "objectId"
    | "bindingStatus"
    | "resolutionStatus"
    | "mvpStatus"
    | "mvpAttention"
    | "evidenceIds"
    | "realityState"
    | "hasData"
    | "hasKPI"
  >[];
  readonly extraEvidence?: readonly NexoraMvpLiveManagementEvidence[];
  readonly datasetId?: string | null;
  readonly runtimeStateId?: string | null;
}): readonly NexoraMvpEffectiveManagementState[] {
  const grouped = new Map<string, NexoraMvpLiveManagementEvidence[]>();
  const push = (entry: NexoraMvpLiveManagementEvidence) => {
    const list = grouped.get(entry.objectId) ?? [];
    list.push(entry);
    grouped.set(entry.objectId, list);
  };
  for (const binding of input.bindings ?? []) {
    push({
      objectId: binding.objectId,
      bindingStatus: binding.bindingStatus,
      resolutionStatus: binding.resolutionStatus,
      mvpStatus: binding.mvpStatus,
      mvpAttention: binding.mvpAttention,
      evidenceIds: binding.evidenceIds,
      realityState: binding.realityState,
      hasData: binding.hasData,
      hasKPI: binding.hasKPI,
      ...(input.datasetId != null ? { datasetId: input.datasetId } : {}),
    });
  }
  for (const extra of input.extraEvidence ?? []) {
    push(extra);
  }

  return Object.freeze(
    input.baselineObjects.map((object) =>
      resolveNexoraMvpEffectiveManagementState({
        canonicalId: object.id,
        baseline: Object.freeze({
          attention: object.attention,
          status: object.status,
        }),
        evidence: grouped.get(object.id) ?? [],
        runtimeStateId: input.runtimeStateId,
      }),
    ),
  );
}
