/**
 * NXA:6-PREP funnel CLI (executed with tsx).
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { NXA_FUNNEL_LEVELS } from "../app/lib/nexora-certification/nxaTestFunnel.ts";
import {
  emptyCertificationLedger,
  evaluateCertificationBarrier,
  markTaskInspected,
  recordTaskCompletion,
  recordTaskStart,
} from "../app/lib/nexora-certification/nxaCertificationTaskLedger.ts";

const frontendRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = process.argv.find((arg) => arg.startsWith("--level="))?.slice(8)
  ?? process.argv[process.argv.indexOf("--level") + 1]
  ?? "1";
const level = Number(raw);
if (level !== 1 && level !== 2 && level !== 3 && level !== 4) {
  console.error("usage: nxa-test-funnel --level 1|2|3|4");
  process.exit(2);
}
const spec = NXA_FUNNEL_LEVELS[level];
const started = Date.now();
let ledger = emptyCertificationLedger();
const commandResults: Array<{
  id: string;
  exitCode: number | null;
  status: "PASSED" | "FAILED";
}> = [];

for (const item of spec.commands) {
  ledger = recordTaskStart(ledger, {
    id: item.id,
    purpose: item.purpose,
    command: item.command,
    required: item.required,
  });
  const ran = spawnSync("zsh", ["-lc", item.command], {
    cwd: frontendRoot,
    encoding: "utf8",
    env: process.env,
  });
  const artifact = join(frontendRoot, ".certification/nxa-6-prep-conversation-diagnostics", `${item.id}.log`);
  mkdirSync(dirname(artifact), { recursive: true });
  writeFileSync(artifact, `${ran.stdout ?? ""}\n${ran.stderr ?? ""}`);
  const status = ran.status === 0 ? "PASSED" : "FAILED";
  ledger = recordTaskCompletion(ledger, {
    id: item.id,
    status,
    exitCode: ran.status,
    artifact: `.certification/nxa-6-prep-conversation-diagnostics/${item.id}.log`,
  });
  ledger = markTaskInspected(ledger, item.id);
  commandResults.push({ id: item.id, exitCode: ran.status, status });
  if (ran.status !== 0) {
    console.error(ran.stdout?.slice(-4000));
    console.error(ran.stderr?.slice(-4000));
    break;
  }
}

const barrier = evaluateCertificationBarrier(ledger);
const passed = commandResults.every((item) => item.status === "PASSED") && commandResults.length === spec.commands.length;
const report = {
  identity: "NXA:6-PREP/TestFunnel",
  level,
  levelName: spec.name,
  durationMs: Date.now() - started,
  passed,
  failed: commandResults.filter((item) => item.status === "FAILED").length,
  skipped: 0,
  exitCode: passed ? 0 : 1,
  blockingFailure: commandResults.find((item) => item.status === "FAILED")?.id ?? null,
  recommendedNextLevel: passed ? spec.recommendedNext : level,
  commands: commandResults,
  barrier,
  ledger,
};

async function writeReports() {
  const outDir = join(frontendRoot, ".certification/nxa-6-prep-conversation-diagnostics");
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, `funnel-level-${level}.json`), JSON.stringify(report, null, 2));
  await mkdir(join(frontendRoot, "artifacts/nxa6-prep"), { recursive: true });
  await writeFile(join(frontendRoot, "artifacts/nxa6-prep/background-task-ledger.json"), JSON.stringify({ ledger, barrier }, null, 2));
  console.log(JSON.stringify({
    level,
    levelName: spec.name,
    passed: report.passed,
    failed: report.failed,
    skipped: report.skipped,
    durationMs: report.durationMs,
    exitCode: report.exitCode,
    blockingFailure: report.blockingFailure,
    recommendedNextLevel: report.recommendedNextLevel,
    barrier,
  }, null, 2));
  process.exit(report.exitCode);
}

void writeReports();
