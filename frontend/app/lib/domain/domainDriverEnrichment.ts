/**
 * B.13.c — domain-aware driver display (same ids; label / evidence enrichment only).
 */

import type { FragilityDriver } from "../../types/fragilityScanner";
import {
  DOMAIN_MATURITY_VOCABULARIES,
  normalizeB13MaturityDomain,
  type B13MaturityDomain,
} from "./domainVocabularyRegistry.ts";

function pickEnrichedLabel(
  baseLabel: string,
  domainKey: B13MaturityDomain,
  table: Record<string, Partial<Record<B13MaturityDomain, string>>>
): string | null {
  const blob = baseLabel.toLowerCase();
  for (const [needle, row] of Object.entries(table)) {
    if (!needle || !blob.includes(needle)) continue;
    const phrase = row[domainKey] ?? row.default ?? row.retail;
    if (phrase) return phrase;
  }
  return null;
}

export function enrichFragilityDriversForDomain(
  drivers: readonly FragilityDriver[] | undefined,
  domainId?: string | null
): FragilityDriver[] {
  if (!drivers?.length) return [];
  const domainKey = normalizeB13MaturityDomain(domainId);
  const table = DOMAIN_MATURITY_VOCABULARIES[domainKey]?.driverLabelEnrichment ?? DOMAIN_MATURITY_VOCABULARIES.default.driverLabelEnrichment;
  return drivers.map((d) => {
    const nextLabel = pickEnrichedLabel(d.label, domainKey, table);
    if (!nextLabel || nextLabel === d.label) return d;
    return { ...d, label: nextLabel };
  });
}

export function driversEnrichmentSignature(before: readonly FragilityDriver[], after: readonly FragilityDriver[]): string {
  const sig = (xs: readonly FragilityDriver[]) =>
    xs.map((x) => `${x.id}:${String(x.label ?? "").slice(0, 120)}`).join("|");
  return `${sig(before)}::${sig(after)}`;
}
