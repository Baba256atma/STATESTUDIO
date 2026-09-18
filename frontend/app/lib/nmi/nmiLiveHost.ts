/**
 * NPA-T NMI:8 — compose a live UnifiedManagementModel from existing catalogs.
 * Read-only adapter. Does not invent missing management structure.
 */

import { getManagerObjectRegisteredSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraMVPContextSubjectKind } from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import {
  composeNmiUnifiedManagementModel,
  type NmiComposeInput,
} from "./nmiFoundation.ts";
import type { NmiCanonicalRef, NmiContextKind, NmiNodeKind, UnifiedManagementModel } from "./nmiContract.ts";
import type { NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import type { NmiManagementMapNodeAnnotation } from "./nmiManagementMapContract.ts";
import { nmiLiveIdentity } from "./nmiLiveIdentity.ts";
import { NMI_LIVE_HOST_CONTRACT } from "./nmiLiveContract.ts";

const CONTEXT_KIND_TO_NMI: Readonly<Record<NexoraMVPContextSubjectKind, NmiNodeKind>> = Object.freeze({
  problem: "PROBLEM",
  scenario: "SCENARIO",
  decision: "DECISION",
  execution: "EXECUTION",
});

export type NmiLiveHostInput = {
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly modelId?: string;
  readonly contextId?: string;
  readonly contextKind?: NmiContextKind;
  readonly observedRealityIds?: readonly string[];
  readonly vaiVariables?: readonly { readonly id: string; readonly title: string }[];
  readonly includeRegisteredGoal?: boolean;
  readonly compositionProvenance?: readonly string[];
};

export type NmiLiveHostedModel = {
  readonly identity: typeof nmiLiveIdentity;
  readonly model: UnifiedManagementModel;
  readonly annotations: readonly NmiManagementMapNodeAnnotation[];
  readonly composerNotAuthority: true;
  readonly secondManagementStore: false;
  readonly writesCanonical: false;
  readonly fabricatesMissingStructure: false;
  readonly readsSealedRmsGroundTruth: false;
};

function ref(id: string, kind: NmiNodeKind, authority: string, sourceRef: string): NmiCanonicalRef {
  return Object.freeze({ id, kind, authority, sourceRef });
}

function declaredRel(
  relationshipId: string,
  fromId: string,
  toId: string,
  kind: NmiManagementRelationship["kind"],
  sourceAuthority: string,
): NmiManagementRelationship {
  return Object.freeze({
    relationshipId,
    fromId,
    toId,
    kind,
    epistemicStatus: "DECLARED" as const,
    causal: false as const,
    convertsAssociationToCause: false as const,
    convertsAssumptionToFact: false as const,
    sourceAuthority,
    sourceRef: relationshipId,
  });
}

export function composeNmiLiveUnifiedManagementModel(input: NmiLiveHostInput): NmiLiveHostedModel {
  const nodes: NmiCanonicalRef[] = [];
  const annotations: NmiManagementMapNodeAnnotation[] = [];
  const present = new Set<string>();

  for (const subject of input.catalog.contextSubjects) {
    if (present.has(subject.id)) continue;
    present.add(subject.id);
    nodes.push(
      ref(
        subject.id,
        CONTEXT_KIND_TO_NMI[subject.kind],
        "NEX-MVP:4/NexoraMVPObjectInteractionCatalog",
        `catalog:context:${subject.id}`,
      ),
    );
    annotations.push(
      Object.freeze({
        id: subject.id,
        title: subject.label,
        knownStatus: subject.status === "risk" ? "WATCH" : subject.status === "watch" ? "WATCH" : "KNOWN",
      }),
    );
  }

  const relationships: NmiManagementRelationship[] = [];
  if (input.includeRegisteredGoal !== false) {
    const problemIds = new Set(input.catalog.contextSubjects.map((item) => item.id));
    for (const goal of getManagerObjectRegisteredSubjects()) {
      if (goal.objectKind !== "goal") continue;
      if (goal.associatedProblemId && !problemIds.has(goal.associatedProblemId)) continue;
      if (!present.has(goal.objectId)) {
        present.add(goal.objectId);
        nodes.push(ref(goal.objectId, "GOAL", "MO:1/ManagerObjectCatalog", `mo:goal:${goal.objectId}`));
        annotations.push(Object.freeze({ id: goal.objectId, title: goal.canonicalName, knownStatus: "KNOWN" }));
      }
      if (goal.associatedProblemId && problemIds.has(goal.associatedProblemId)) {
        relationships.push(
          declaredRel(
            `mo:goal-supports:${goal.objectId}:${goal.associatedProblemId}`,
            goal.objectId,
            goal.associatedProblemId,
            "supports",
            "MO:1/ManagerObjectCatalog",
          ),
        );
      }
    }
  }

  for (const variable of input.vaiVariables ?? []) {
    if (present.has(variable.id)) continue;
    present.add(variable.id);
    nodes.push(ref(variable.id, "VARIABLE", "VAI:1", `vai:${variable.id}`));
    annotations.push(Object.freeze({ id: variable.id, title: variable.title }));
  }

  const composeInput: NmiComposeInput = {
    modelId: input.modelId ?? "nmi8:live:executive",
    contextId: input.contextId ?? "nmi8:live:context",
    contextKind: input.contextKind ?? "UNKNOWN",
    nodes: Object.freeze(nodes),
    relationships: Object.freeze(relationships),
    unresolvedRelationshipIds: Object.freeze([]),
    observedRealityIds: Object.freeze([...(input.observedRealityIds ?? [])]),
    simulationStateIds: Object.freeze([]),
    compositionProvenance: Object.freeze([
      ...(input.compositionProvenance ?? []),
      nmiLiveIdentity,
      "NEX-MVP:4/NexoraMVPObjectInteractionCatalog",
      "MO:1/ManagerObjectCatalog",
    ]),
  };
  const model = composeNmiUnifiedManagementModel(composeInput);
  return Object.freeze({
    identity: nmiLiveIdentity,
    model,
    annotations: Object.freeze(annotations),
    composerNotAuthority: true as const,
    secondManagementStore: false as const,
    writesCanonical: false as const,
    fabricatesMissingStructure: false as const,
    readsSealedRmsGroundTruth: false as const,
  });
}

export function nmiLiveHostDoesNotWrite(catalog: NexoraMVPObjectInteractionCatalog): typeof NMI_LIVE_HOST_CONTRACT {
  void catalog;
  return NMI_LIVE_HOST_CONTRACT;
}
