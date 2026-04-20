/**
 * B.37 — Pilot / locale domain pack (operator insight, review/synthesis wording, B.13 hooks).
 * Distinct from shell `NexoraDomainPack` in `domainPackRegistry.ts`.
 */

/** Canonical ids for B.35 / B.36 / locale resolution. */
export const NEXORA_LOCALE_DOMAIN_IDS = ["generic", "retail", "supply_chain", "finance", "psych_yung"] as const;
export type NexoraLocaleDomainId = (typeof NEXORA_LOCALE_DOMAIN_IDS)[number];

/**
 * JSON-safe, deterministic locale pack. Missing optional sections fall back to `generic` at runtime.
 */
export type NexoraLocaleDomainPack = {
  id: NexoraLocaleDomainId;
  label: string;
  aliases: string[];

  /** B.13 — extra payload alias stems merged additively into B.6 expansion. */
  vocabulary?: Record<string, string[]>;

  /** B.35 — keys like `line_weak`, `hint_compare` (see `REQUIRED_INSIGHT_MAPPING_KEYS`). */
  insightMapping?: Record<string, string>;

  /** B.36 — generic canonical phrase → localized phrase for pilot review. */
  reviewMapping?: Record<string, string>;

  /** B.36 — generic canonical phrase → localized phrase for pilot synthesis. */
  synthesisMapping?: Record<string, string>;

  /** B.13 — additive trust evidence bias (clamped with existing B.13 logic). */
  trustBias?: number;

  /** Optional tone / microcopy hints for future surfaces. */
  toneHints?: Record<string, string>;

  /** B.39 — rollout hints (optional; conservative defaults apply when omitted). */
  rollout?: {
    allowPilot?: boolean;
    allowProduct?: boolean;
  };

  tags?: string[];
};

/** Spec / user-doc name alias (pilot locale pack). */
export type NexoraDomainPack = NexoraLocaleDomainPack;
