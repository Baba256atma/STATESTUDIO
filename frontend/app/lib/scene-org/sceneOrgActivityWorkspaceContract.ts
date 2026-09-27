import type { NexoraMVPFlowDomainState } from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";

/** NPA-T ORG:7 — read-only Activity projection over existing flow records. */
export const sceneOrgActivityWorkspaceContractIdentity =
  "NPA-T ORG:7/ActivityNaturalLanguageWorkspaceControl" as const;

export type SceneOrgActivityEntry = Readonly<{
  id: string;
  occurredAt: string;
  eventType: string;
  canonicalSubjectId: string;
  relatedCanonicalIds: readonly string[];
  title: string;
  description: string;
  sourceRecordIds: readonly string[];
}>;

export function projectSceneOrgManagerActivity(
  state: NexoraMVPFlowDomainState,
): readonly SceneOrgActivityEntry[] {
  const journalByTimelineId = new Map(
    state.journalPacks.map((pack) => [pack.timelineEventId, pack] as const),
  );
  return Object.freeze(
    [...state.timelineEvents]
      .sort((left, right) => right.occurredAt.localeCompare(left.occurredAt))
      .map((event) => {
        const journal = journalByTimelineId.get(event.id) ?? null;
        return Object.freeze({
          id: `activity:${event.id}`,
          occurredAt: event.occurredAt,
          eventType: event.kind,
          canonicalSubjectId: event.subjectId,
          relatedCanonicalIds: Object.freeze([
            ...(event.objectId ? [event.objectId] : []),
            ...(journal?.relatedObjectIds ?? []),
          ].filter((id, index, all) => all.indexOf(id) === index)),
          title: journal?.title ?? event.label,
          description: journal?.summary ?? event.label,
          sourceRecordIds: Object.freeze([
            event.id,
            ...(journal ? [journal.id] : []),
          ]),
        });
      }),
  );
}

export const SCENE_ORG_ACTIVITY_AUTHORITY_GUARD = Object.freeze({
  readsTimelineEvents: true,
  readsJournalPacks: true,
  createsEventLedger: false,
  reconstructsHistoricalBusinessState: false,
  implementsReplay: false,
  mutatesBusinessTruth: false,
  createsNaturalLanguageParser: false,
  createsCommandRouter: false,
  createsReferentResolver: false,
  createsWorkspaceRuntime: false,
  storesSavedBusinessState: false,
});
