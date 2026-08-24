/**
 * MO:1 — generic executive object context.
 * Collects available identity, evidence, and relationships. Never fabricates.
 */

import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { getNexoraMVPSubjectPresentationFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures.ts";
import {
  collectNexoraLiveRelationshipSources,
  resolveNexoraLiveLinkedSubjectOfKind,
} from "@/app/lib/nex-mvp/nexoraLiveEpistemicProjection.ts";
import {
  findManagerObjectCatalogRecord,
  mapCatalogKindToManagerObjectKind,
} from "./managerObjectCatalog.ts";
import type {
  ManagerObjectKind,
  ManagerObjectSupportStatus,
} from "./managerObjectInteractionFoundation.ts";

export type ManagerObjectField<T> = {
  readonly value: T | null;
  readonly support: ManagerObjectSupportStatus;
  readonly sourceAuthority: string | null;
};

export type ManagerObjectRelationship = {
  readonly relationshipId: string;
  readonly otherId: string | null;
  readonly otherLabel: string;
  readonly relationKind: string;
  readonly support: ManagerObjectSupportStatus;
};

export type ManagerObjectContext = {
  readonly objectId: string | null;
  readonly identity: ManagerObjectField<string>;
  readonly objectKind: ManagerObjectField<ManagerObjectKind>;
  readonly executiveMeaning: ManagerObjectField<string>;
  readonly currentState: ManagerObjectField<string>;
  readonly kpi: ManagerObjectField<{
    readonly label: string;
    readonly value: string;
    readonly target: string | null;
    readonly status: string | null;
  }>;
  readonly provenance: ManagerObjectField<readonly string[]>;
  readonly relationships: readonly ManagerObjectRelationship[];
  readonly parentChild: ManagerObjectField<{
    readonly parentIds: readonly string[];
    readonly childIds: readonly string[];
  }>;
  readonly associatedGoal: ManagerObjectField<string>;
  readonly associatedProblem: ManagerObjectField<string>;
  readonly associatedRisk: ManagerObjectField<string>;
  readonly scenarios: ManagerObjectField<readonly string[]>;
  readonly decisions: ManagerObjectField<readonly string[]>;
  readonly execution: ManagerObjectField<string>;
  readonly outcomes: ManagerObjectField<readonly string[]>;
  readonly confidence: ManagerObjectField<string>;
};

function field<T>(
  value: T | null | undefined,
  support: ManagerObjectSupportStatus,
  sourceAuthority: string | null,
): ManagerObjectField<T> {
  if (value == null) {
    return Object.freeze({
      value: null,
      support: "UNKNOWN",
      sourceAuthority: null,
    });
  }
  return Object.freeze({ value, support, sourceAuthority });
}

function unknownField<T>(): ManagerObjectField<T> {
  return field<T>(null, "UNKNOWN", null);
}

function resolveIdentity(
  objectId: string,
  catalog: NexoraMVPObjectInteractionCatalog,
): {
  readonly label: string;
  readonly kind: ManagerObjectKind;
  readonly state: string | null;
} | null {
  const registered = findManagerObjectCatalogRecord(objectId);
  if (registered) {
    return {
      label: registered.canonicalName,
      kind: registered.objectKind,
      state: null,
    };
  }
  const object = catalog.objects.find((entry) => entry.id === objectId);
  if (object) {
    return {
      label: object.label,
      kind:
        objectId.startsWith("goal-")
          ? "goal"
          : objectId.startsWith("issue-problem-") ||
              objectId.startsWith("ctx-problem-")
            ? "problem"
            : objectId.startsWith("issue-risk-")
              ? "risk"
              : objectId.startsWith("issue-opportunity-")
                ? "opportunity"
                : objectId.startsWith("issue-scenario-") ||
                    objectId.startsWith("ctx-scenario-")
                  ? "scenario"
                  : "object",
      state: object.status,
    };
  }
  const context = catalog.contextSubjects.find((entry) => entry.id === objectId);
  if (context) {
    return {
      label: context.label,
      kind: mapCatalogKindToManagerObjectKind(context.kind),
      state: context.status,
    };
  }
  return null;
}

export function collectManagerObjectContext(
  objectId: string | null,
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): ManagerObjectContext {
  if (objectId == null) {
    return emptyContext(null);
  }
  const identity = resolveIdentity(objectId, catalog);
  if (identity == null) {
    return emptyContext(objectId);
  }

  const presentation = getNexoraMVPSubjectPresentationFixture(objectId);
  const registered = findManagerObjectCatalogRecord(objectId);
  const liveRelationships = collectNexoraLiveRelationshipSources(objectId);
  const relationships = liveRelationships.map((edge) =>
    Object.freeze({
      relationshipId: edge.relationshipId,
      otherId: edge.otherId,
      otherLabel: edge.otherLabel,
      relationKind: edge.relationKind,
      support:
        edge.relationKind === "related" || edge.relationKind === "associated-with"
          ? ("INFERRED" as const)
          : ("KNOWN" as const),
    }),
  );
  for (const rel of catalog.relationships) {
    if (rel.sourceId !== objectId && rel.targetId !== objectId) continue;
    const otherId = rel.sourceId === objectId ? rel.targetId : rel.sourceId;
    if (relationships.some((entry) => entry.otherId === otherId)) continue;
    const other =
      catalog.objects.find((entry) => entry.id === otherId) ??
      catalog.contextSubjects.find((entry) => entry.id === otherId);
    relationships.push(
      Object.freeze({
        relationshipId: rel.id,
        otherId,
        otherLabel: other?.label ?? otherId,
        relationKind: "related",
        support: "KNOWN" as const,
      }),
    );
  }
  if (registered?.associatedObjectId) {
    const associatedObject = catalog.objects.find(
      (entry) => entry.id === registered.associatedObjectId,
    );
    relationships.push(
      Object.freeze({
        relationshipId: `mo1-goal-object:${registered.objectId}`,
        otherId: registered.associatedObjectId,
        otherLabel: associatedObject?.label ?? registered.associatedObjectId,
        relationKind: "acts-on",
        support: "KNOWN" as const,
      }),
    );
  }
  if (registered?.associatedProblemId) {
    const associatedProblem = catalog.contextSubjects.find(
      (entry) => entry.id === registered.associatedProblemId,
    );
    relationships.push(
      Object.freeze({
        relationshipId: `mo1-goal-problem:${registered.objectId}`,
        otherId: registered.associatedProblemId,
        otherLabel: associatedProblem?.label ?? registered.associatedProblemId,
        relationKind: "constrained-by",
        support: "KNOWN" as const,
      }),
    );
  }

  const inboundParents = relationships
    .filter(
      (edge) =>
        edge.relationKind === "constrained-by" ||
        edge.relationKind === "depends-on",
    )
    .map((edge) => edge.otherId)
    .filter((id): id is string => id != null);
  const outboundChildren = relationships
    .filter(
      (edge) =>
        edge.relationKind === "affects" || edge.relationKind === "acts-on",
    )
    .map((edge) => edge.otherId)
    .filter((id): id is string => id != null);

  const linkedProblem =
    resolveNexoraLiveLinkedSubjectOfKind(objectId, "problem") ??
    registered?.associatedProblemId ??
    null;
  const linkedGoal =
    objectId === registered?.objectId
      ? registered.objectId
      : registered &&
          (registered.associatedObjectId === objectId ||
            registered.associatedProblemId === objectId)
        ? registered.objectId
        : null;
  const linkedScenario = resolveNexoraLiveLinkedSubjectOfKind(
    objectId,
    "scenario",
  );
  const linkedDecision = resolveNexoraLiveLinkedSubjectOfKind(
    objectId,
    "decision",
  );
  const linkedExecution = resolveNexoraLiveLinkedSubjectOfKind(
    objectId,
    "execution",
  );
  const linkedRisk =
    identity.kind === "problem" || objectId === "obj-risk"
      ? objectId === "obj-risk"
        ? objectId
        : linkedProblem
      : objectId === "obj-risk"
        ? objectId
        : null;

  const kpi =
    presentation?.primaryKpi != null
      ? {
          label: presentation.primaryKpi.label,
          value: presentation.primaryKpi.value,
          target: presentation.primaryKpi.target ?? null,
          status: presentation.primaryKpi.status ?? null,
        }
      : null;

  const provenance: string[] = [];
  if (presentation) provenance.push("NEX-MVP:6/presentation-fixture");
  if (liveRelationships.length > 0) {
    provenance.push("NEX-MVP:4/context-links+stage-relationships");
  }
  if (registered) provenance.push("MO:1/registered-goal");

  return Object.freeze({
    objectId,
    identity: field(identity.label, "KNOWN", "NEX-MVP:4/catalog"),
    objectKind: field(identity.kind, "KNOWN", "NEX-MVP:4/catalog"),
    executiveMeaning: field(
      presentation?.summary ??
        (identity.kind === "goal"
          ? "This goal represents the outcome you’re trying to achieve in the current executive context."
          : null),
      presentation?.summary || identity.kind === "goal" ? "KNOWN" : "UNKNOWN",
      presentation?.summary
        ? "NEX-MVP:6/presentation-fixture"
        : identity.kind === "goal"
          ? "MO:1/generic-goal-meaning"
          : null,
    ),
    currentState: field(
      presentation?.essentialStatus ?? identity.state,
      presentation?.essentialStatus || identity.state ? "KNOWN" : "UNKNOWN",
      "NEX-MVP:4/catalog",
    ),
    kpi: field(
      kpi,
      kpi ? "KNOWN" : "UNKNOWN",
      kpi ? "RDI / NEX-MVP:6" : null,
    ),
    provenance: field(
      provenance.length > 0 ? Object.freeze(provenance) : null,
      provenance.length > 0 ? "KNOWN" : "UNKNOWN",
      provenance[0] ?? null,
    ),
    relationships: Object.freeze(relationships),
    parentChild: field(
      inboundParents.length || outboundChildren.length
        ? {
            parentIds: Object.freeze(inboundParents),
            childIds: Object.freeze(outboundChildren),
          }
        : null,
      inboundParents.length || outboundChildren.length ? "INFERRED" : "UNKNOWN",
      "recorded-relationship-projection",
    ),
    associatedGoal: field(
      linkedGoal,
      linkedGoal ? "KNOWN" : "UNKNOWN",
      linkedGoal ? "MO:1/registered-goal" : null,
    ),
    associatedProblem: field(
      linkedProblem,
      linkedProblem ? "KNOWN" : "UNKNOWN",
      linkedProblem ? "NEX-MVP:4/context-links" : null,
    ),
    associatedRisk: field(
      linkedRisk && identity.kind === "problem" ? linkedRisk : objectId === "obj-risk" ? "obj-risk" : null,
      objectId === "obj-risk" || (linkedRisk && identity.kind === "problem")
        ? "KNOWN"
        : "UNKNOWN",
      objectId === "obj-risk" ? "NEX-MVP:3/stage-object" : null,
    ),
    scenarios: field(
      linkedScenario ? Object.freeze([linkedScenario]) : null,
      linkedScenario ? "KNOWN" : "UNKNOWN",
      linkedScenario ? "NEX-MVP:4/context-links" : null,
    ),
    decisions: field(
      linkedDecision ? Object.freeze([linkedDecision]) : null,
      linkedDecision ? "KNOWN" : "UNKNOWN",
      linkedDecision ? "NEX-MVP:4/context-links" : null,
    ),
    execution: field(
      linkedExecution,
      linkedExecution ? "KNOWN" : "UNKNOWN",
      linkedExecution ? "NEX-MVP:4/context-links" : null,
    ),
    outcomes: unknownField<readonly string[]>(),
    confidence: field(
      kpi ? "limited" : null,
      kpi ? "INFERRED" : "UNKNOWN",
      kpi ? "CORE-INT:2 reader" : null,
    ),
  });
}

function emptyContext(objectId: string | null): ManagerObjectContext {
  return Object.freeze({
    objectId,
    identity: unknownField<string>(),
    objectKind: unknownField<ManagerObjectKind>(),
    executiveMeaning: unknownField<string>(),
    currentState: unknownField<string>(),
    kpi: unknownField<{
      readonly label: string;
      readonly value: string;
      readonly target: string | null;
      readonly status: string | null;
    }>(),
    provenance: unknownField<readonly string[]>(),
    relationships: Object.freeze([]),
    parentChild: unknownField<{
      readonly parentIds: readonly string[];
      readonly childIds: readonly string[];
    }>(),
    associatedGoal: unknownField<string>(),
    associatedProblem: unknownField<string>(),
    associatedRisk: unknownField<string>(),
    scenarios: unknownField<readonly string[]>(),
    decisions: unknownField<readonly string[]>(),
    execution: unknownField<string>(),
    outcomes: unknownField<readonly string[]>(),
    confidence: unknownField<string>(),
  });
}
