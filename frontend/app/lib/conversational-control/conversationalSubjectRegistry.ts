/**
 * CC:2 — Read-only conversational subject registry helpers.
 *
 * Does not own domain catalogs. Projects supplied canonical subjects into a
 * match index. Optional MVP adapter builds a projection from Stage fixtures.
 */

import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import { NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import type {
  NexoraConversationalSubjectKind,
  NexoraConversationalSubjectRecord,
} from "./conversationalContext.ts";
import { normalizeNexoraConversationalUtterance } from "./conversationalIntentNormalization.ts";

export type NexoraConversationalSubjectMatchIndex = {
  readonly subjectsById: ReadonlyMap<string, NexoraConversationalSubjectRecord>;
  readonly subjects: readonly NexoraConversationalSubjectRecord[];
};

export type NexoraConversationalSubjectProjectionSource = {
  readonly objects?: readonly {
    readonly id: string;
    readonly label: string;
    readonly kind?: string;
  }[];
  readonly contextSubjects?: readonly {
    readonly id: string;
    readonly label: string;
    readonly kind: string;
  }[];
};

export function freezeConversationalSubjectRecord(
  record: NexoraConversationalSubjectRecord,
): NexoraConversationalSubjectRecord {
  return Object.freeze({
    subjectId: record.subjectId,
    subjectKind: record.subjectKind,
    canonicalName: record.canonicalName,
    aliases: Object.freeze([...(record.aliases ?? [])]),
    businessKey: record.businessKey ?? null,
  });
}

export function buildNexoraConversationalSubjectMatchIndex(
  subjects: readonly NexoraConversationalSubjectRecord[],
): NexoraConversationalSubjectMatchIndex {
  const frozen = Object.freeze(
    subjects.map((s) => freezeConversationalSubjectRecord(s)),
  );
  const subjectsById = new Map<string, NexoraConversationalSubjectRecord>();
  for (const subject of frozen) {
    subjectsById.set(subject.subjectId, subject);
  }
  return Object.freeze({
    subjectsById,
    subjects: frozen,
  });
}

export function normalizeConversationalMatchKey(value: string): string {
  return normalizeNexoraConversationalUtterance(value);
}

/**
 * Deterministic candidate match against registered subjects.
 * Exact normalized equality on: subjectId, canonicalName, aliases, businessKey.
 * Never synthesizes IDs. Never fuzzy-ranks.
 */
export function findCanonicalSubjectMatchesForHint(
  hintRaw: string,
  index: NexoraConversationalSubjectMatchIndex,
): readonly NexoraConversationalSubjectRecord[] {
  const key = normalizeConversationalMatchKey(hintRaw);
  if (!key) return Object.freeze([]);

  const matches: NexoraConversationalSubjectRecord[] = [];
  const seen = new Set<string>();

  for (const subject of index.subjects) {
    const candidates = [
      subject.subjectId,
      subject.canonicalName,
      subject.businessKey ?? "",
      ...(subject.aliases ?? []),
    ]
      .filter(Boolean)
      .map((v) => normalizeConversationalMatchKey(String(v)));

    if (!candidates.includes(key)) continue;
    if (seen.has(subject.subjectId)) continue;
    seen.add(subject.subjectId);
    matches.push(subject);
  }

  return Object.freeze(matches);
}

function asSubjectKind(kind: string): NexoraConversationalSubjectKind {
  switch (kind) {
    case "object":
    case "goal":
    case "problem":
    case "scenario":
    case "decision":
    case "execution":
    case "workspace":
    case "business":
      return kind;
    default:
      return "unknown";
  }
}

/**
 * Project a catalog-shaped snapshot into CC:2 subject records.
 * Read-only adapter — fixtures remain owned by nex-mvp.
 */
export function projectNexoraConversationalSubjectsFromCatalog(
  source: NexoraConversationalSubjectProjectionSource = {},
): readonly NexoraConversationalSubjectRecord[] {
  const objects = (source.objects ?? []).map((o) =>
    freezeConversationalSubjectRecord({
      subjectId: o.id,
      subjectKind: asSubjectKind(o.kind ?? "object"),
      canonicalName: o.label,
      aliases: defaultAliasesForObject(o.id, o.label),
      businessKey: o.id,
    }),
  );

  const contexts = (source.contextSubjects ?? []).map((c) =>
    freezeConversationalSubjectRecord({
      subjectId: c.id,
      subjectKind: asSubjectKind(c.kind),
      canonicalName: c.label,
      aliases: Object.freeze([c.label]),
      businessKey: c.id,
    }),
  );

  return Object.freeze([...objects, ...contexts]);
}

/**
 * Default MVP Stage projection used by tests and local executive tooling.
 */
export function projectDefaultNexoraMvpConversationalSubjects(): readonly NexoraConversationalSubjectRecord[] {
  return projectNexoraConversationalSubjectsFromCatalog({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
  });
}

function defaultAliasesForObject(
  id: string,
  label: string,
): readonly string[] {
  const aliases: string[] = [label];
  // Explicit registered aliases only — not fuzzy invention.
  if (id === "obj-revenue") {
    aliases.push("sales revenue", "revenue object");
  }
  if (id === "obj-capacity") {
    aliases.push("production capacity", "capacity object");
  }
  if (id === "obj-budget") {
    aliases.push("budget object", "the budget");
  }
  return Object.freeze(aliases);
}
