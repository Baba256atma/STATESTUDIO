/**
 * CORE-INT:1 — connectivity invariants only.
 * Does not implement intelligence capabilities or change /executive behavior.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { nexoraExecutiveShellVersion } from "../nex-mvp/nexoraExecutiveShell.ts";
import {
  getNexoraManagerMvpReleaseBaselineIdentity,
  nexoraManagerMvpReleaseBaselineIdentity,
} from "../nex-mvp/nexoraManagerMvpReleaseBaseline.ts";
import { NEXORA_EXI3_ENRICHMENT_BOUNDARY } from "../nex-mvp/nexoraExecutiveIntelligenceExperienceGrounding.ts";

const here = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(here, "../../..");
const libRoot = join(here, "..");

function walkTsFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.endsWith(".test.ts") || entry.name.endsWith(".test.tsx")) {
        continue;
      }
      walkTsFiles(path, acc);
      continue;
    }
    if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes(".test.")) {
      acc.push(path);
    }
  }
  return acc;
}

function productionSources(): string[] {
  return [
    ...walkTsFiles(join(libRoot, "nex-mvp")),
    ...walkTsFiles(join(frontendRoot, "app/executive")),
  ];
}

test("CORE-INT:1 /executive and nex-mvp production sources do not import EI:1–EI:6", () => {
  const forbidden = /executive-intelligence\//;
  const allowed = /nexoraSharedEpistemicFoundation|nexoraGroundedCausalConstraintIntelligence|nexoraExecutivePriorityIntelligence|nexoraExecutiveTradeoffIntelligence|nexoraLiveOutcomeIntelligence|nexoraLiveOutcomeObservationCapture/;
  const hits: string[] = [];
  for (const file of productionSources()) {
    const source = readFileSync(file, "utf8");
    if (forbidden.test(source) && !allowed.test(source)) {
      hits.push(relative(frontendRoot, file));
    }
  }
  assert.deepEqual(hits, []);
});

test("CORE-INT:1 EI:4 trade-off writer is not referenced by /executive runtime", () => {
  const pattern = /createScenarioPriorityTradeoffTrace|resolveExplainablePriority/;
  const hits: string[] = [];
  for (const file of productionSources()) {
    const source = readFileSync(file, "utf8");
    if (pattern.test(source)) hits.push(relative(frontendRoot, file));
  }
  assert.deepEqual(hits, []);
  assert.equal(NEXORA_EXI3_ENRICHMENT_BOUNDARY.ei4LiveOnExecutive, false);
});

test("CORE-INT:1 EI:3 claim writer is not referenced by /executive runtime", () => {
  const pattern = /createExecutiveClaim|createEvidenceBoundedRelationship|createExecutiveConstraintReference/;
  const hits: string[] = [];
  for (const file of productionSources()) {
    const source = readFileSync(file, "utf8");
    if (pattern.test(source)) hits.push(relative(frontendRoot, file));
  }
  assert.deepEqual(hits, []);
});

test("CORE-INT:1 frozen MVP identity is unchanged", () => {
  const identity = getNexoraManagerMvpReleaseBaselineIdentity();
  assert.equal(nexoraManagerMvpReleaseBaselineIdentity, "MVP:1/NexoraManagerMVPReleaseBaseline");
  assert.equal(identity.version, "1.2.0");
  assert.equal(identity.version, nexoraExecutiveShellVersion);
  assert.equal(identity.canonicalRoute, "/executive");
});
