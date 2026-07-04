import type { NormalizedExecutiveJudgmentContext } from "./executiveJudgmentContextNormalizer.ts";
import { validateExecutiveJudgmentContext, type ExecutiveJudgmentContextValidation } from "./executiveJudgmentContextValidation.ts";

export type ExecutiveJudgmentContextSnapshotEntry = Readonly<{
  section: string;
  count: number;
  identifiers: readonly string[];
}>;

export type ExecutiveJudgmentContextSnapshot = Readonly<{
  contextId: string;
  workspaceId: string;
  sectionCount: number;
  entries: readonly ExecutiveJudgmentContextSnapshotEntry[];
  validation: ExecutiveJudgmentContextValidation;
  fingerprint: string;
  immutable: true;
  deterministic: true;
  metadataOnly: true;
}>;

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function idsForSection(context: NormalizedExecutiveJudgmentContext, section: string): readonly string[] {
  if (section === "platformMetadata") {
    return Object.freeze(context.platformMetadata.map((item) => item.platformId).sort());
  }
  const values = context[section as Exclude<keyof NormalizedExecutiveJudgmentContext, "baseContext" | "platformMetadata" | "sectionOrder" | "deterministic" | "metadataOnly">];
  return Object.freeze(values.map((item) => item.id).sort());
}

export function buildExecutiveJudgmentSnapshot(context: NormalizedExecutiveJudgmentContext): ExecutiveJudgmentContextSnapshot {
  const entries = Object.freeze(
    context.sectionOrder.map((section) => {
      const identifiers = idsForSection(context, section);
      return Object.freeze({ section, count: identifiers.length, identifiers });
    })
  );
  const validation = validateExecutiveJudgmentContext(context);
  const base = Object.freeze({
    contextId: context.baseContext.contextId,
    workspaceId: context.baseContext.workspaceId,
    sectionCount: entries.length,
    entries,
    validation,
    immutable: true as const,
    deterministic: true as const,
    metadataOnly: true as const,
  });
  const fingerprint = stableHash([
    base.contextId,
    base.workspaceId,
    base.entries.map((entry) => `${entry.section}:${entry.identifiers.join(",")}`).join("|"),
    base.validation.valid,
    base.immutable,
    base.deterministic,
    base.metadataOnly,
  ].join("||"));

  return Object.freeze({ ...base, fingerprint });
}
