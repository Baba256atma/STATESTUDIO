/**
 * NEXORA-ZERO-FAILURE-GATE
 *
 * Summarizer for the required phase-completion gate. Does not create a
 * second CI system. Reads command results / certification JSON and refuses
 * CERTIFIED while any required failure remains.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

export function evaluateZeroFailureGate(input) {
  const testsFail = Number(input.tests?.fail ?? 1);
  const typeErrors = Number(input.typecheck?.errors ?? 1);
  const buildExit = Number(input.build?.exitCode ?? 1);
  const lintErrors = Number(input.lint?.errors ?? 1);
  const smokeOk = input.runtimeSmoke?.ok === true;
  const uncaught = Number(input.console?.uncaught ?? 1);
  const hydration = Number(input.console?.hydration ?? 1);
  const duplicateKeys = Number(input.console?.duplicateKeys ?? 1);
  const phase = String(input.phase ?? "CORE-OUT:1A");

  const knownFailures = [];
  if (testsFail !== 0) knownFailures.push(`tests.fail=${testsFail}`);
  if (typeErrors !== 0) knownFailures.push(`typecheck.errors=${typeErrors}`);
  if (buildExit !== 0) knownFailures.push(`build.exit=${buildExit}`);
  if (lintErrors !== 0) knownFailures.push(`lint.errors=${lintErrors}`);
  if (!smokeOk) knownFailures.push("runtime-smoke.not-ok");
  if (uncaught !== 0) knownFailures.push(`console.uncaught=${uncaught}`);
  if (hydration !== 0) knownFailures.push(`console.hydration=${hydration}`);
  if (duplicateKeys !== 0) {
    knownFailures.push(`console.duplicateKeys=${duplicateKeys}`);
  }

  const certified = knownFailures.length === 0;
  return Object.freeze({
    identity: "NEXORA-ZERO-FAILURE-GATE",
    phase,
    certified,
    status: certified
      ? `${phase}-ZERO-FAILURE-CERTIFIED`
      : `${phase}-BLOCKED-BY-REGRESSION`,
    knownFailures: Object.freeze(knownFailures),
    knownFailureCount: knownFailures.length,
    gates: Object.freeze({
      typecheck: typeErrors === 0,
      build: buildExit === 0,
      tests: testsFail === 0,
      lint: lintErrors === 0,
      liveSmoke: smokeOk,
      console: uncaught === 0 && hydration === 0 && duplicateKeys === 0,
    }),
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const payloadPath = process.argv[2];
  if (!payloadPath) {
    console.error("usage: nexora-zero-failure-gate.mjs <payload.json>");
    process.exit(2);
  }
  const { readFile } = await import("node:fs/promises");
  const payload = JSON.parse(await readFile(payloadPath, "utf8"));
  const outDir = payload.outDir ?? ".certification/core-out1a-zero-failure-closure";
  const OUT = join(process.cwd(), outDir);
  await mkdir(OUT, { recursive: true });
  const gate = evaluateZeroFailureGate(payload);
  await writeFile(join(OUT, "zero-failure-gate.json"), JSON.stringify(gate, null, 2));
  console.log(JSON.stringify(gate, null, 2));
  process.exit(gate.certified ? 0 : 1);
}
