import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const flow = readFileSync(join(here, "NexoraCsvRealDataImportFlow.tsx"), "utf8");
const explorer = readFileSync(join(here, "NexoraExecutiveDataExplorer.tsx"), "utf8");
const shell = readFileSync(join(here, "../NexoraExecutiveShell.tsx"), "utf8");

test("DATA-UX:3 Data Rail enriches the existing RDI mapping and routes one Advisor question", () => {
  assert.match(flow, /interpretCsvSemantics/);
  assert.match(flow, /previousMapping:\s*props\.replacementSource\?\.prepared\.mapping/);
  assert.match(flow, /nextCsvSemanticClarification/);
  assert.match(flow, /Ask Nexora/);
  assert.doesNotMatch(flow, /chatbot|semanticStore|setTimeout/);
});

test("DATA-UX:3 Explorer is only a bridge and owns no dialogue state", () => {
  assert.match(explorer, /onSemanticClarificationRequest/);
  assert.doesNotMatch(explorer, /pendingSemantic|conversationMessages|createEmptyNca/);
});

test("DATA-UX:3 shell resolves the NCA pending field before canonical ordinary conversation", () => {
  const resolveAt = shell.indexOf("const semanticReply = resolveNcaCsvSemanticReply");
  const executeAt = shell.indexOf("executeNexoraConversationalExperience({", resolveAt);
  assert.ok(resolveAt >= 0 && executeAt > resolveAt);
  const branch = shell.slice(resolveAt, executeAt);
  assert.match(branch, /csvSemanticResolverRef\.current\(trimmed\)/);
  assert.doesNotMatch(branch, /setInteraction|setApplication|onSelectSubject/);
});

test("DATA-UX:3 semantic clarification leaves Stage and DATA_OBJECT authority untouched", () => {
  assert.doesNotMatch(flow, /setInteraction|StageCommand|Evidence/);
  assert.match(shell, /onSemanticClarificationRequest=\{onCsvSemanticClarificationRequest\}/);
});
