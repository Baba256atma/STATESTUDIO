/**
 * LLM-MVP:5 — apply deterministic governance to the live Phase-4/3 contribution.
 * Does not make a second provider call.
 */

import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { governNexoraLlmOutput } from "./nexoraLlmGovernedOutput.ts";
import type { NexoraLlmManagementContext } from "./nexoraLlmManagementContext.ts";

const artifact = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../artifacts/LLM-MVP-5/live-provider.json",
);

test("live provider L is governed locally with D recoverable", () => {
  assert.equal(existsSync(artifact), true, "run backend/tests/test_nexora_llm_governed_live.py first");
  const live = JSON.parse(readFileSync(artifact, "utf8")) as {
    deterministicResponse: string;
    contribution: string;
    providerCalls: number;
    managementContext: NexoraLlmManagementContext;
    provider: string;
    model: string;
    policyReason: string;
    usage: unknown;
    cost: unknown;
  };
  assert.equal(live.providerCalls, 1);
  const governed = governNexoraLlmOutput({
    deterministicResponse: live.deterministicResponse,
    contribution: live.contribution,
    participantStatus: "succeeded",
    managementContext: live.managementContext,
  });
  assert.equal(governed.deterministicResponse, live.deterministicResponse);
  assert.ok(
    governed.status === "accepted" ||
      governed.status === "rejected" ||
      governed.status === "fallback",
  );
  if (governed.status !== "accepted") {
    assert.equal(governed.managerText, live.deterministicResponse);
    assert.equal(governed.llmContributionUsed, false);
  } else {
    assert.equal(governed.llmContributionUsed, true);
    assert.match(governed.managerText, /Capacity/i);
  }
  const out = join(dirname(artifact), "live-governance.json");
  writeFileSync(
    out,
    `${JSON.stringify(
      {
        provider: live.provider,
        model: live.model,
        policyReason: live.policyReason,
        providerCalls: live.providerCalls,
        llmStatus: "succeeded",
        governanceStatus: governed.status,
        reason: governed.reason,
        llmContributionUsed: governed.llmContributionUsed,
        dRecoverable: governed.deterministicResponse === live.deterministicResponse,
        mEqualsD: governed.managerText === live.deterministicResponse,
        managerText: governed.managerText,
        usage: live.usage,
        cost: live.cost,
      },
      null,
      2,
    )}\n`,
  );
});
