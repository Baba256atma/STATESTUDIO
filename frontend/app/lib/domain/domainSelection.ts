import { normalizeDomainId } from "./domainHelpers.ts";
import type { NexoraDomainId } from "./domainTypes.ts";

export type DomainSelectionState = {
  activeDomainId: NexoraDomainId;
  source: "default" | "user" | "inferred" | "project";
};

const VALID_SELECTION_SOURCES = new Set<DomainSelectionState["source"]>([
  "default",
  "user",
  "inferred",
  "project",
]);

function isSelectionSource(value: unknown): value is DomainSelectionState["source"] {
  return typeof value === "string" && VALID_SELECTION_SOURCES.has(value as DomainSelectionState["source"]);
}

export function createDefaultDomainSelection(): DomainSelectionState {
  return {
    activeDomainId: "general",
    source: "default",
  };
}

export function resolveDomainSelection(value: unknown): DomainSelectionState {
  if (value && typeof value === "object") {
    const record = value as { activeDomainId?: unknown; domainId?: unknown; source?: unknown };
    const activeDomainId = normalizeDomainId(record.activeDomainId ?? record.domainId);
    return {
      activeDomainId,
      source: isSelectionSource(record.source) ? record.source : "default",
    };
  }

  const activeDomainId = normalizeDomainId(value);
  return {
    activeDomainId,
    source: activeDomainId === "general" ? "default" : "user",
  };
}
