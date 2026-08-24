/**
 * MO:1 — registered executive subjects for generic object interaction.
 * Projects existing Stage/context catalogs. Does not invent Stage graphics.
 */

import type { NexoraConversationalSubjectRecord } from "@/app/lib/conversational-control/conversationalContext.ts";
import {
  freezeConversationalSubjectRecord,
  projectNexoraConversationalSubjectsFromCatalog,
} from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { ManagerObjectKind } from "./managerObjectInteractionFoundation.ts";

export type ManagerObjectCatalogRecord = {
  readonly objectId: string;
  readonly objectKind: ManagerObjectKind;
  readonly canonicalName: string;
  readonly aliases: readonly string[];
  readonly associatedObjectId: string | null;
  readonly associatedProblemId: string | null;
};

/**
 * Registered Goal overlay. Capacity Gap already exists as a problem;
 * this Goal is the executive subject of that recorded problem, not a
 * fabricated KPI or relationship.
 */
export const MANAGER_OBJECT_REGISTERED_GOAL: ManagerObjectCatalogRecord =
  Object.freeze({
    objectId: "goal-capacity-availability",
    objectKind: "goal",
    canonicalName: "Close Capacity Gap",
    aliases: Object.freeze(["Goal", "capacity goal", "close capacity gap"]),
    associatedObjectId: "obj-capacity",
    associatedProblemId: "ctx-problem-capacity",
  });

export function getManagerObjectRegisteredSubjects(): readonly ManagerObjectCatalogRecord[] {
  return Object.freeze([MANAGER_OBJECT_REGISTERED_GOAL]);
}

export function projectManagerObjectConversationalSubjects(
  catalog: NexoraMVPObjectInteractionCatalog = getDefaultNexoraMVPObjectInteractionCatalog(),
): readonly NexoraConversationalSubjectRecord[] {
  const projected = projectNexoraConversationalSubjectsFromCatalog({
    objects: catalog.objects,
    contextSubjects: catalog.contextSubjects,
  }).map((subject) =>
    subject.subjectId.startsWith("goal-")
      ? freezeConversationalSubjectRecord({
          ...subject,
          subjectKind: "goal",
          aliases: Object.freeze([
            ...(subject.aliases ?? []),
            "Goal",
            subject.canonicalName,
          ]),
        })
      : subject.subjectId.startsWith("issue-problem-") ||
          subject.subjectId.startsWith("ctx-problem-")
        ? freezeConversationalSubjectRecord({
            ...subject,
            subjectKind: "problem",
            aliases: Object.freeze([
              ...(subject.aliases ?? []),
              "Problem",
              "the Problem",
              subject.canonicalName,
            ]),
          })
      : subject.subjectId.startsWith("issue-scenario-")
        ? freezeConversationalSubjectRecord({
            ...subject,
            subjectKind: "scenario",
            aliases: Object.freeze([
              ...(subject.aliases ?? []),
              "Scenario",
              subject.canonicalName,
            ]),
          })
      : subject.subjectId.startsWith("cc10:decision:") ||
          subject.subjectId.startsWith("issue-decision-")
        ? freezeConversationalSubjectRecord({
            ...subject,
            subjectKind: "decision",
            aliases: Object.freeze([
              ...(subject.aliases ?? []),
              "Decision",
              "this decision",
              subject.canonicalName,
            ]),
          })
      : subject.subjectId.startsWith("execution-") ||
          subject.subjectId.startsWith("cc11:execution")
        ? freezeConversationalSubjectRecord({
            ...subject,
            subjectKind: "execution",
            aliases: Object.freeze([
              ...(subject.aliases ?? []),
              "Execution",
              "this execution",
              subject.canonicalName,
            ]),
          })
        : subject.subjectId.startsWith("outcome-")
          ? freezeConversationalSubjectRecord({
              ...subject,
              subjectKind: "outcome",
              aliases: Object.freeze([
                ...(subject.aliases ?? []),
                "Outcome",
                "this outcome",
                subject.canonicalName,
              ]),
            })
        : subject.subjectId.startsWith("learning-")
          ? freezeConversationalSubjectRecord({
              ...subject,
              subjectKind: "object",
              aliases: Object.freeze([
                ...(subject.aliases ?? []),
                "Learning",
                "this learning",
                subject.canonicalName,
              ]),
            })
        : subject,
  );
  const scenarioOrder = catalog.objects
    .filter((object) => object.id.startsWith("issue-scenario-"))
    .map((object) => object.id);
  const withLetters = projected.map((subject) => {
    const index = scenarioOrder.indexOf(subject.subjectId);
    if (index < 0) return subject;
    const letter = String.fromCharCode(65 + index);
    return freezeConversationalSubjectRecord({
      ...subject,
      subjectKind: "scenario",
      aliases: Object.freeze([
        ...(subject.aliases ?? []),
        `Scenario ${letter}`,
        "Scenario",
        subject.canonicalName,
      ]),
    });
  });
  const includeDemoGoal = catalog.objects.some(
    (object) => object.id === "obj-capacity",
  );
  const overlay = includeDemoGoal
    ? getManagerObjectRegisteredSubjects().map((entry) =>
        freezeConversationalSubjectRecord({
          subjectId: entry.objectId,
          subjectKind: "goal",
          canonicalName: entry.canonicalName,
          aliases: entry.aliases,
          businessKey: entry.objectId,
        }),
      )
    : [];
  const seen = new Set(withLetters.map((subject) => subject.subjectId));
  return Object.freeze([
    ...withLetters,
    ...overlay.filter((subject) => !seen.has(subject.subjectId)),
  ]);
}

export function findManagerObjectCatalogRecord(
  objectId: string,
): ManagerObjectCatalogRecord | null {
  return (
    getManagerObjectRegisteredSubjects().find(
      (entry) => entry.objectId === objectId,
    ) ?? null
  );
}

export function mapCatalogKindToManagerObjectKind(
  kind: string | null | undefined,
): ManagerObjectKind {
  if (kind === "goal") return "goal";
  if (kind === "problem") return "problem";
  if (kind === "scenario") return "scenario";
  if (kind === "decision") return "decision";
  if (kind === "execution") return "execution";
  if (kind === "outcome") return "outcome";
  if (kind === "object") return "object";
  if (kind === "risk") return "risk";
  if (kind === "opportunity") return "opportunity";
  return "unknown";
}
