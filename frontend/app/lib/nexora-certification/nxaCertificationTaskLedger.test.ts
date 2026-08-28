import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyCertificationLedger,
  evaluateCertificationBarrier,
  markTaskInspected,
  recordTaskCompletion,
  recordTaskStart,
} from "./nxaCertificationTaskLedger.ts";

test("duplicate running starts are not recorded", () => {
  let ledger = emptyCertificationLedger();
  ledger = recordTaskStart(ledger, { id: "a", purpose: "t", command: "echo", required: true });
  const again = recordTaskStart(ledger, { id: "a", purpose: "t", command: "echo", required: true });
  assert.equal(again.tasks.length, 1);
});

test("CERTIFIED barrier requires finished inspected passing required tasks", () => {
  let ledger = emptyCertificationLedger();
  ledger = recordTaskStart(ledger, {
    id: "gate",
    purpose: "unit",
    command: "test",
    required: true,
    startedAt: "2026-08-26T00:00:00.000Z",
  });
  assert.equal(evaluateCertificationBarrier(ledger).allowed, false);
  assert.equal(evaluateCertificationBarrier(ledger).requiredStillRunning, 1);
  ledger = recordTaskCompletion(ledger, {
    id: "gate",
    status: "PASSED",
    exitCode: 0,
    completedAt: "2026-08-26T00:00:01.000Z",
    artifact: "out.json",
  });
  assert.equal(evaluateCertificationBarrier(ledger).requiredUninspected, 1);
  ledger = markTaskInspected(ledger, "gate");
  const barrier = evaluateCertificationBarrier(ledger);
  assert.equal(barrier.allowed, true);
  assert.equal(barrier.requiredPassed, 1);
  assert.equal(barrier.requiredFailed, 0);
  assert.equal(barrier.requiredStillRunning, 0);
  assert.equal(barrier.requiredUninspected, 0);
});

test("a long-lived nonessential task does not block certification", () => {
  let ledger = emptyCertificationLedger();
  ledger = recordTaskStart(ledger, {
    id: "dev",
    purpose: "existing Next.js server",
    command: "npm run dev",
    required: false,
  });
  ledger = recordTaskStart(ledger, { id: "unit", purpose: "tests", command: "test", required: true });
  ledger = recordTaskCompletion(ledger, { id: "unit", status: "PASSED", exitCode: 0 });
  ledger = markTaskInspected(ledger, "unit");
  const barrier = evaluateCertificationBarrier(ledger);
  assert.equal(barrier.allowed, true);
  assert.equal(barrier.nonessentialStillRunning, 1);
});
