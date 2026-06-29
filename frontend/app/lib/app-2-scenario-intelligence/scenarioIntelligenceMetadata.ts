/**
 * APP-2:1 — Scenario Intelligence metadata contract.
 * Metadata shape and defaults — no persistence or mutation authority.
 */

import {
  SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION,
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_IDENTITY,
  SCENARIO_INTELLIGENCE_SOURCE,
} from "./scenarioIntelligenceContract.ts";
import type {
  ScenarioMetadataPlatform,
  ScenarioMetadataRecord,
  ScenarioMetadataSource,
} from "./scenarioIntelligenceTypes.ts";

export const SCENARIO_INTELLIGENCE_METADATA_VERSION = "APP-2/1" as const;

export const SCENARIO_METADATA_MANDATORY_FIELDS = Object.freeze([
  "version",
  "createdAt",
  "updatedAt",
  "architecture",
  "certification",
  "freeze",
  "source",
  "build",
  "platform",
] as const);

export const SCENARIO_METADATA_PLATFORM: ScenarioMetadataPlatform = "nexora-type-c";

export const SCENARIO_METADATA_DEFAULT_SOURCE: ScenarioMetadataSource =
  SCENARIO_INTELLIGENCE_SOURCE;

export function createScenarioMetadataRecord(
  input: Partial<ScenarioMetadataRecord> = {}
): ScenarioMetadataRecord {
  const timestamp = new Date(0).toISOString();
  return Object.freeze({
    version: input.version ?? SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    createdAt: input.createdAt ?? timestamp,
    updatedAt: input.updatedAt ?? timestamp,
    architecture: input.architecture ?? SCENARIO_INTELLIGENCE_ARCHITECTURE_VERSION,
    certification: input.certification ?? SCENARIO_INTELLIGENCE_IDENTITY.certificationStatus,
    freeze: input.freeze ?? SCENARIO_INTELLIGENCE_IDENTITY.freezeState,
    source: input.source ?? SCENARIO_METADATA_DEFAULT_SOURCE,
    build: input.build ?? SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
    platform: input.platform ?? SCENARIO_METADATA_PLATFORM,
  });
}

export function validateScenarioMetadataShape(
  input: Partial<ScenarioMetadataRecord>
): Readonly<{ valid: boolean; missing: readonly string[] }> {
  const missing = SCENARIO_METADATA_MANDATORY_FIELDS.filter(
    (field) => !(field in input) || input[field as keyof ScenarioMetadataRecord] === undefined
  );
  return Object.freeze({ valid: missing.length === 0, missing: Object.freeze(missing) });
}
