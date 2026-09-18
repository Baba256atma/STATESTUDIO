/**
 * NPA-T NMI:8 — live NMI:1–7 pipeline over a hosted UnifiedManagementModel.
 * Reuses certified modules. Does not implement parallel production versions.
 */

import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NmiAdvisorBundle } from "./nmiAdvisorContract.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import type { ManagementMap, NmiManagementMapSection } from "./nmiManagementMapContract.ts";
import {
  composeNmiManagementNavigation,
} from "./nmiManagementNavigationCompose.ts";
import type {
  NmiManagementNavigation,
  NmiNavigationSection,
  NmiQueueEntryInput,
  NmiQueueSubjectInput,
} from "./nmiManagementNavigationContract.ts";
import { composeNmiStageProjection } from "./nmiStageProjectionCompose.ts";
import type { NmiStageProjection, NmiStageProjectionSource } from "./nmiStageProjectionContract.ts";
import {
  composeNmiLiveUnifiedManagementModel,
  type NmiLiveHostInput,
} from "./nmiLiveHost.ts";
import { nmiLiveIdentity } from "./nmiLiveIdentity.ts";
import { NMI_LIVE_HOST_CONTRACT, NMI_LIVE_PIPELINE } from "./nmiLiveContract.ts";

const SECTION_TO_NAV: Readonly<Record<NmiManagementMapSection, NmiNavigationSection>> = Object.freeze({
  CONTEXT: "CONTEXT",
  GOALS: "GOALS",
  OPERATIONS: "OPERATIONS",
  KPI_DATA: "KPI_DATA",
  PROBLEMS: "PROBLEMS_RISKS",
  RISKS: "PROBLEMS_RISKS",
  VARIABLES: "VARIABLES",
  SCENARIOS: "SCENARIOS",
  DECISIONS: "DECISIONS",
  EXECUTIONS: "EXECUTIONS",
  OUTCOMES: "OUTCOMES_LEARNING",
  LEARNING: "OUTCOMES_LEARNING",
});

export type NmiLiveQueueEntry = {
  readonly category: string;
  readonly count: number;
  readonly objectIds: readonly string[];
};

export type NmiLiveOverlayMapNode = {
  readonly section: NmiNavigationSection;
  readonly nodeId: string;
  readonly title: string;
};

export type NmiLiveManagementIntelligence = {
  readonly identity: typeof nmiLiveIdentity;
  readonly pipeline: typeof NMI_LIVE_PIPELINE;
  readonly model: ReturnType<typeof composeNmiLiveUnifiedManagementModel>["model"];
  readonly map: ManagementMap;
  readonly navigation: NmiManagementNavigation;
  readonly advisorBundle: NmiAdvisorBundle;
  readonly overlayMapNodes: readonly NmiLiveOverlayMapNode[];
  readonly secondManagementStore: false;
  readonly secondQueue: false;
  readonly writesCanonical: false;
  readonly bypassesGate: false;
  readonly readsSealedRmsGroundTruth: false;
  readonly startsDthExp: false;
};

export function toNmiLiveQueueEntries(
  entries: readonly NmiLiveQueueEntry[] | undefined,
): readonly NmiQueueEntryInput[] {
  return Object.freeze(
    (entries ?? []).map((entry) =>
      Object.freeze({
        category: entry.category as NmiQueueEntryInput["category"],
        count: entry.count,
        objectIds: entry.objectIds,
      }),
    ),
  );
}

export function composeNmiLiveOverlayMapNodes(map: ManagementMap): readonly NmiLiveOverlayMapNode[] {
  return Object.freeze(
    map.nodes.map((node) =>
      Object.freeze({
        section: SECTION_TO_NAV[node.section],
        nodeId: node.nodeId,
        title: node.title ?? node.nodeId,
      }),
    ),
  );
}

export function hostNmiLiveManagementIntelligence(input: {
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly queueEntries?: readonly NmiLiveQueueEntry[];
  readonly focusedSubjectId?: string | null;
  readonly host?: Omit<NmiLiveHostInput, "catalog">;
}): NmiLiveManagementIntelligence {
  const hosted = composeNmiLiveUnifiedManagementModel({
    catalog: input.catalog,
    ...(input.host ?? {}),
  });
  const map = composeNmiManagementMap({
    mapId: `nmi8:map:${hosted.model.modelId}`,
    model: hosted.model,
    annotations: hosted.annotations,
    compositionProvenance: Object.freeze([nmiLiveIdentity, "NMI:2"]),
  });
  const subjects: readonly NmiQueueSubjectInput[] = Object.freeze(
    input.catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        title: subject.label,
        attention: subject.attention,
        status: subject.status,
        workKind: subject.kind,
      }),
    ),
  );
  const queueEntries = toNmiLiveQueueEntries(input.queueEntries);
  const navigation = composeNmiManagementNavigation({
    queueEntries,
    subjects,
    map,
    selectedCanonicalId: input.focusedSubjectId ?? null,
    selectedSource: "MAP",
  });
  const advisorBundle: NmiAdvisorBundle = Object.freeze({
    map,
    queueEntries,
    subjects,
    stageProjectionAnchorId: input.focusedSubjectId ?? null,
  });
  return Object.freeze({
    identity: nmiLiveIdentity,
    pipeline: NMI_LIVE_PIPELINE,
    model: hosted.model,
    map,
    navigation,
    advisorBundle,
    overlayMapNodes: composeNmiLiveOverlayMapNodes(map),
    secondManagementStore: false as const,
    secondQueue: navigation.secondQueue,
    writesCanonical: false as const,
    bypassesGate: NMI_LIVE_HOST_CONTRACT.bypassesGate,
    readsSealedRmsGroundTruth: false as const,
    startsDthExp: false as const,
  });
}

export function projectNmiLiveSelectionToStage(input: {
  readonly live: NmiLiveManagementIntelligence;
  readonly selectedCanonicalId: string;
  readonly source: NmiStageProjectionSource;
}): NmiStageProjection {
  return composeNmiStageProjection({
    projectionId: `nmi8:stage:${input.selectedCanonicalId}`,
    selectedCanonicalId: input.selectedCanonicalId,
    source: input.source,
    map: input.live.map,
  });
}
