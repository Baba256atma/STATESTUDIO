/**
 * NPA-T NMI:5 — compose Management Navigation over Queue Attention and NMI:2 map.
 * Selection preserves canonical identity. Does not project onto Stage.
 */

import type { ManagementMap, NmiManagementMapSection } from "./nmiManagementMapContract.ts";
import type { NmiContextKind } from "./nmiContract.ts";
import {
  NMI_NAVIGATION_SECTIONS,
  type NmiManagementNavigation,
  type NmiMapNavigationView,
  type NmiNavigationMode,
  type NmiNavigationSection,
  type NmiQueueEntryInput,
  type NmiQueueSubjectInput,
  type NmiSelectionIdentity,
} from "./nmiManagementNavigationContract.ts";
import { nmiManagementNavigationIdentity } from "./nmiManagementNavigationIdentity.ts";
import { composeNmiAttentionItems } from "./nmiAttentionCompose.ts";

const SECTION_MAP: Readonly<Record<NmiNavigationSection, readonly NmiManagementMapSection[]>> = Object.freeze({
  CONTEXT: Object.freeze(["CONTEXT"] as const),
  GOALS: Object.freeze(["GOALS"] as const),
  OPERATIONS: Object.freeze(["OPERATIONS"] as const),
  KPI_DATA: Object.freeze(["KPI_DATA"] as const),
  PROBLEMS_RISKS: Object.freeze(["PROBLEMS", "RISKS"] as const),
  VARIABLES: Object.freeze(["VARIABLES"] as const),
  SCENARIOS: Object.freeze(["SCENARIOS"] as const),
  DECISIONS: Object.freeze(["DECISIONS"] as const),
  EXECUTIONS: Object.freeze(["EXECUTIONS"] as const),
  OUTCOMES_LEARNING: Object.freeze(["OUTCOMES", "LEARNING"] as const),
});

export type NmiManagementNavigationComposeInput = {
  readonly queueEntries: readonly NmiQueueEntryInput[];
  readonly subjects?: readonly NmiQueueSubjectInput[];
  readonly map?: ManagementMap | null;
  readonly mode?: NmiNavigationMode;
  readonly section?: NmiNavigationSection | null;
  readonly selectedCanonicalId?: string | null;
  readonly selectedSource?: "QUEUE" | "MAP";
};

function mapViews(map: ManagementMap | null): readonly NmiMapNavigationView[] {
  return Object.freeze(
    NMI_NAVIGATION_SECTIONS.map((section) => {
      const mapSections = SECTION_MAP[section];
      const nodeIds = Object.freeze(
        (map?.nodes ?? [])
          .filter((node) => mapSections.includes(node.section))
          .map((node) => node.nodeId),
      );
      return Object.freeze({
        section,
        mapSections: SECTION_MAP[section],
        nodeIds,
        count: nodeIds.length,
      });
    }),
  );
}

function selection(
  id: string | null | undefined,
  source: "QUEUE" | "MAP",
  items: NmiManagementNavigation["attentionItems"],
  map: ManagementMap | null,
): NmiSelectionIdentity | null {
  if (!id) return null;
  const attention = items.find((item) => item.itemId === id);
  const node = map?.nodes.find((item) => item.nodeId === id);
  if (!attention && !node) {
    return Object.freeze({
      canonicalId: id,
      kind: "PROBLEM",
      source,
      substitutesSubject: false as const,
    });
  }
  return Object.freeze({
    canonicalId: id,
    kind: node?.kind ?? attention?.canonicalRef.kind ?? "PROBLEM",
    source,
    substitutesSubject: false as const,
  });
}

export function composeNmiManagementNavigation(input: NmiManagementNavigationComposeInput): NmiManagementNavigation {
  const map = input.map ?? null;
  const attentionItems = composeNmiAttentionItems({
    queueEntries: input.queueEntries,
    subjects: input.subjects,
    map,
    contextKind: map?.contextKind,
  });
  const selected = selection(input.selectedCanonicalId, input.selectedSource ?? "QUEUE", attentionItems, map);
  const contextKind: NmiContextKind = map?.contextKind ?? "UNKNOWN";
  return Object.freeze({
    identity: nmiManagementNavigationIdentity,
    mode: input.mode ?? "ATTENTION",
    section: input.section ?? null,
    contextKind,
    hybridLanes: map?.hybridLanes ?? null,
    attentionItems,
    attentionCount: attentionItems.length,
    queueEntries: Object.freeze([...input.queueEntries]),
    mapViews: mapViews(map),
    selected,
    secondQueue: false,
    mutatesQueueAuthority: false,
    mutatesObjects: false,
    mutatesDecisions: false,
    mutatesExecutions: false,
    projectsOntoStage: false,
    inventsPriorityScore: false,
    parallelAdvisor: false,
    bypassesGate: false,
    readsSealedRmsGroundTruth: false,
    startsNmi6: false,
  });
}

export function selectNmiNavigationItem(
  navigation: NmiManagementNavigation,
  canonicalId: string,
  source: "QUEUE" | "MAP" = "QUEUE",
  map?: ManagementMap | null,
): NmiManagementNavigation {
  return composeNmiManagementNavigation({
    queueEntries: navigation.queueEntries,
    map: map ?? null,
    mode: navigation.mode,
    section: navigation.section,
    selectedCanonicalId: canonicalId,
    selectedSource: source,
  });
}

export function filterNmiMapSection(
  navigation: NmiManagementNavigation,
  section: NmiNavigationSection,
): NmiMapNavigationView {
  return (
    navigation.mapViews.find((item) => item.section === section) ??
    Object.freeze({
      section,
      mapSections: Object.freeze([]),
      nodeIds: Object.freeze([]),
      count: 0,
    })
  );
}

export function rejectSealedRmsNavigationFact(factId: string): {
  readonly factId: string;
  readonly known: false;
  readonly readsSealedRmsGroundTruth: false;
} {
  return Object.freeze({
    factId,
    known: false as const,
    readsSealedRmsGroundTruth: false as const,
  });
}
