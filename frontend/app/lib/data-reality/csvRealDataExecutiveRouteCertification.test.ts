import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  RDI2_CANONICAL_RUNTIME_PATHNAME,
  RDI2_CANONICAL_RUNTIME_URL,
  assertRdi2CanonicalRuntimeUrl,
  verifyRdi2CanonicalRuntimeUrl,
} from "./csvRealDataExecutiveRouteCertification.ts";

const here = dirname(fileURLToPath(import.meta.url));

test("locks all RDI:2 certification to /executive", () => {
  assert.equal(RDI2_CANONICAL_RUNTIME_URL, "http://localhost:3000/executive");
  assert.equal(RDI2_CANONICAL_RUNTIME_PATHNAME, "/executive");
  assert.equal(assertRdi2CanonicalRuntimeUrl(RDI2_CANONICAL_RUNTIME_URL).valid, true);
  assert.equal(verifyRdi2CanonicalRuntimeUrl("http://localhost:3000/").valid, false);
  assert.throws(() => assertRdi2CanonicalRuntimeUrl("http://localhost:3000/"), /requires pathname "\/executive"/);
});

test("canonical Executive shell owns the Data Explorer integration", () => {
  const shell = readFileSync(join(here, "../../executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  const explorer = readFileSync(join(here, "../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx"), "utf8");
  assert.match(shell, /explorerKind === "data"/);
  assert.match(shell, /NexoraExecutiveDataExplorer/);
  assert.match(shell, /activeCsvDataset/);
  assert.match(explorer, /data-rdi2-canonical-route="\/executive"/);
  assert.match(explorer, /\+ Add Data/);
});

test("wrong-surface shells no longer mount the RDI:2 flow", () => {
  const legacyIntake = readFileSync(join(here, "../../components/panels/SourceControlPanel.tsx"), "utf8");
  const operational = readFileSync(join(here, "../../components/main-right-panel/workspace/operational/WorkspaceDataSourcePanel.tsx"), "utf8");
  assert.doesNotMatch(legacyIntake, /CsvRealDataImportFlow/);
  assert.doesNotMatch(operational, /CsvRealDataImportFlow/);
});
