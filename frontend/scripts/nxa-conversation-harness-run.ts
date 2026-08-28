import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NXA_CERTIFIED_CONVERSATION_CASES } from "../app/lib/nexora-certification/nxaConversationCertifiedCases.ts";
import { renderHarnessMarkdown, runConversationHarness } from "../app/lib/nexora-certification/nxaConversationHarness.ts";

const frontendRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const result = runConversationHarness(NXA_CERTIFIED_CONVERSATION_CASES);
const outDir = join(frontendRoot, ".certification/nxa-6-prep-conversation-diagnostics");

async function main() {
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "harness-result.json"), JSON.stringify(result, null, 2));
  await writeFile(join(outDir, "harness-report.md"), renderHarnessMarkdown(result));
  await mkdir(join(frontendRoot, "artifacts/nxa6-prep"), { recursive: true });
  await writeFile(join(frontendRoot, "artifacts/nxa6-prep/harness-report.md"), renderHarnessMarkdown(result));
  await writeFile(join(frontendRoot, "artifacts/nxa6-prep/harness-result.json"), JSON.stringify(result, null, 2));
  console.log(renderHarnessMarkdown(result));
  process.exit(result.passed ? 0 : 1);
}

void main();
