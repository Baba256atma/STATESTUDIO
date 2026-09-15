/**
 * MRA:3 final independent recertification (RECERT-3) — live /executive.
 * Certification evidence only. This script does not modify production state or code.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const out = join(
  process.cwd(),
  process.env.MRA_OUTPUT ?? "artifacts/mra/MRA-3-FINAL-RECERT-3",
);
const LEAK =
  /\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|DTH|POST:\d|DATA-ADV|canonicalWriter|INSUFFICIENT_REALITY|composition fidelity|runtime authority|continuity resolver)\b/i;
const SUBJECT_STEAL =
  /^(?:Nexora)?(?:Margin Pressure needs urgent|Prioritize Margin Pressure)/i;

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      server.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForHttp(url, attempts = 100) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { redirect: "manual" });
      if (response.status > 0) return;
    } catch {
      // bounded startup retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function readShell(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const conversation = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
      intentKind: conversation?.getAttribute("data-intent-kind") ?? "",
      nluOperation: shell?.getAttribute("data-nlu-operation") ?? "",
      continuitySubject: shell?.getAttribute("data-continuity-subject") ?? "",
      continuityActive: shell?.getAttribute("data-continuity-active") ?? "",
      continuityInvestigation:
        shell?.getAttribute("data-continuity-investigation") ?? "",
      nxaReferent: shell?.getAttribute("data-nxa1-referent") ?? "",
      explanationSummary: shell?.getAttribute("data-mo2-summary") ?? "",
      experienceLane: shell?.getAttribute("data-mo-int1-lane") ?? "",
      attentionPrimary: shell?.getAttribute("data-mo6-primary") ?? "",
      stageMode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      canonicalApproved:
        shell?.getAttribute("data-canonical-approved-decision-count") ?? "0",
      canonicalExecutions:
        shell?.getAttribute("data-canonical-execution-count") ?? "0",
      dataRoute: shell?.getAttribute("data-advisor-data-route") ?? "none",
      compositionResolved:
        conversation?.getAttribute("data-composition-resolved-subject") ?? "",
      compositionCandidate:
        conversation?.getAttribute("data-composition-candidate-subject") ?? "",
      compositionSelected:
        conversation?.getAttribute("data-composition-selected-subject") ?? "",
      compositionCompatible:
        conversation?.getAttribute("data-composition-compatible") ?? "",
      compositionStaleScenarioBlocked:
        conversation?.getAttribute("data-composition-stale-scenario-blocked") ?? "",
    };
  });
}

async function clickTestId(page, id) {
  await page.evaluate((testId) => {
    const node = document.querySelector(`[data-testid="${testId}"]`);
    if (!(node instanceof HTMLElement)) throw new Error(`missing ${testId}`);
    node.click();
  }, id);
}

async function importCsv(page) {
  await page
    .locator('[data-csv-hydrated="true"]')
    .waitFor({ state: "attached", timeout: 20000 });
  if (!(await page.getByTestId("nexora-rdi2-data-explorer").count())) {
    await clickTestId(page, "nexora-stage-data-control");
  }
  await page
    .getByTestId("nexora-rdi2-data-explorer")
    .waitFor({ state: "visible", timeout: 15000 });
  await clickTestId(page, "nexora-rdi2-add-data");
  await page
    .getByTestId("nexora-rdi4-source-choice")
    .waitFor({ state: "visible" });
  await page
    .locator('[data-testid="nexora-rdi4-source-choice"] button')
    .first()
    .evaluate((node) => node instanceof HTMLElement && node.click());
  const fileInput = page.getByTestId("nexora-csv-file-input");
  await fileInput.waitFor({ state: "attached", timeout: 15000 });
  await fileInput.setInputFiles("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
  await page
    .getByTestId("nexora-csv-understanding-summary")
    .waitFor({ state: "visible", timeout: 20000 });
  const validate = page.getByRole("button", { name: "Validate Import" });
  if (await validate.count()) {
    await validate.evaluate(
      (node) => node instanceof HTMLElement && node.click(),
    );
  }
  const use = page.getByTestId("nexora-csv-use-this-data");
  if (await use.count()) {
    await use.waitFor({ state: "visible", timeout: 15000 });
    await use.click();
    await page.waitForTimeout(800);
  }
}

function textCheck(id, row, expected, anti = null) {
  const text = row?.reply ?? "";
  return {
    id,
    pass: expected.test(text) && (!anti || !anti.test(text)),
    expected: String(expected),
    anti: anti ? String(anti) : null,
    actual: text.slice(0, 420),
  };
}

const started = { child: null };
try {
  let base = process.env.EXECUTIVE_URL ?? null;
  if (!base) {
    const port = await findFreePort();
    const child = spawn(
      "npx",
      ["next", "start", "-H", "127.0.0.1", "-p", String(port)],
      {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, PORT: String(port) },
      },
    );
    started.child = child;
    child.stderr.on("data", (chunk) => process.stderr.write(chunk));
    base = `http://127.0.0.1:${port}/executive`;
    await waitForHttp(base);
  } else {
    base = base.split("?")[0];
  }

  const url = `${base}?reset=1`;
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  await mkdir(out, { recursive: true });

  await openExecutivePage(page, url);
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase("nexora-csv-real-data");
      req.onsuccess = () => resolve(null);
      req.onerror = () => reject(req.error);
      req.onblocked = () => resolve(null);
    });
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  await page.waitForTimeout(700);

  const live = {
    identity:
      process.env.MRA_IDENTITY ??
      "NPA-T MRA:3-FINAL-RECERT-3/IndependentLiveManagerSimulation",
    url,
    startedAt: new Date().toISOString(),
    pageErrors,
    managerTurns: [],
    interactions: [],
    checks: [],
  };

  async function turn(id, utterance) {
    const chat = await askExecutiveChat(page, utterance);
    const row = {
      turn: live.managerTurns.length + 1,
      id,
      managerTurn: utterance,
      reply: chat.last,
      leak: LEAK.test(chat.last ?? ""),
      ...(await readShell(page)),
    };
    live.managerTurns.push(row);
    return row;
  }

  async function interaction(id, action) {
    await action();
    await page.waitForTimeout(500);
    live.interactions.push({ id, ...(await readShell(page)) });
  }

  await turn("open-hi", "Hi.");
  await turn("open-situation", "What's happening today?");
  await turn("open-stage", "What am I looking at?");
  await turn("problems-show", "Show me the problems.");
  await turn("problems-count", "How many are there?");
  await turn("problems-priority", "Which one matters most?");
  await turn("problems-first", "Explain the first one.");
  await turn("problems-other", "What about the other one?");
  await turn("problems-urgent", "Which is more urgent?");
  await turn("problems-why", "Why?");

  await turn("scenarios-show", "Show me the scenarios.");
  await turn("scenarios-second", "Explain the second one.");
  await turn("scenarios-more", "Tell me more about it.");
  await turn("scenarios-first", "What about the first one?");
  await turn("scenarios-compare", "Compare those two.");
  await turn("scenarios-risk", "Which one has less risk?");

  await turn("surge-focus", "Demand Surge");
  await turn("surge-explain", "Explain it.");
  await turn("surge-evidence", "What evidence supports that?");
  await turn("surge-sure", "How sure are you?");
  await turn("surge-uncertain", "What's uncertain?");
  await turn("surge-impact", "What impact could it have?");
  await turn("surge-interrupt", "What can you help me with?");
  await turn("surge-return", "Tell me more about Demand Surge.");
  await turn("surge-investigate", "Investigate it.");
  await turn("surge-deeper", "Look deeper into it.");
  await turn("surge-what-else", "What else do we know about it?");

  await turn("expansion-explicit", "Investigate Capacity Expansion Plan.");
  await turn("expansion-more", "Tell me more.");
  await turn("surge-go-back", "Go back to Demand Surge.");
  await turn("surge-stage", "What's on Stage now?");

  await interaction("import-csv", async () => importCsv(page));
  await turn("data-find", "Do we have any CSV files?");
  await turn("data-contents", "What's in this one?");
  await turn("data-explain", "Explain it.");
  await turn("data-understood", "What do you understand from it?");
  await turn("data-unknown", "What don't you understand?");
  await turn("data-fields", "Which fields are confirmed?");
  await turn("data-kpi", "What KPI can you reliably calculate?");
  await turn("data-cause", "Does this CSV prove the cause?");

  await turn("capacity-return", "Okay, go back to Capacity Gap.");
  await turn("capacity-explain", "Explain it.");
  await turn("capacity-investigate", "Investigate it.");
  await turn("capacity-more", "Tell me more about it.");
  const revenue = page.locator(
    '[data-testid="nexora-stage-object-control-obj-revenue"]',
  );
  if (await revenue.count()) {
    await interaction("stage-click-revenue", async () => {
      await revenue.evaluate((node) => node instanceof HTMLElement && node.click());
    });
  }
  await turn("capacity-explicit-return", "Look at Capacity Gap.");
  await turn("capacity-post-click-explain", "Explain it.");
  await turn("capacity-post-click-more", "Tell me more about it.");
  await turn("capacity-post-click-investigate", "Investigate it.");
  await turn("data-return", "What was that CSV telling us again?");

  await turn("kpi-focus", "Look at Capacity.");
  await turn("kpi-explain", "Explain it.");
  await turn("kpi-trend", "What's the trend?");
  await turn("kpi-good-bad", "Is this good or bad?");
  await turn("kpi-data", "What data supports it?");
  await turn("kpi-investigate", "Investigate it.");

  await turn("risk-focus", "Show me Risk.");
  await turn("risk-explain", "Explain this risk.");
  await turn("risk-serious", "How serious is it?");
  await turn("risk-evidence", "What evidence do we have?");
  await turn("risk-unknown", "What don't we know?");
  await turn("risk-investigate", "Investigate it.");
  await turn("causal-surge", "Did Demand Surge cause this?");
  await turn("causal-capacity", "So Capacity Gap definitely caused the problem, right?");

  await turn("recommend-return", "Go back to Demand Surge.");
  await turn("recommend-ask", "What do you recommend?");
  await turn("recommend-why", "Why?");
  await turn("recommend-sure", "How sure are you?");
  await turn("recommend-uncertainty", "What's the biggest uncertainty?");
  await turn("recommend-wait", "What happens if we do nothing?");
  await turn("recommend-really", "Is that really your recommendation?");
  const beforePreference = await readShell(page);
  await turn("decision-preference", "I like this option.");
  await turn("decision-tentative", "I think we should do it.");
  const beforeApproval = await readShell(page);
  await turn("decision-approve", "Approve Demand Surge.");
  await turn("decision-approved", "Did we approve it?");
  await turn("decision-show", "Show me the decision.");
  await turn("decision-status", "What's its status?");

  await turn("execution-next", "What happens next?");
  await turn("execution-ready", "Are we ready to start?");
  await turn("execution-missing", "What's missing?");
  const beforeStart = await readShell(page);
  await turn("execution-start", "Start it.");
  await turn("execution-started", "Did it start?");
  await turn("execution-status", "What's its status?");
  await turn("execution-blockers", "What are the blockers?");

  const beforeMutation = await readShell(page);
  await turn("mutation-add", "Add this as a Risk.");
  await turn("mutation-interrupt", "Actually, show me the scenarios.");
  await turn("mutation-stale-yes", "Yes.");
  await turn("mutation-delete", "Delete Margin Pressure.");
  await turn("mutation-reject", "No, don't do that.");
  await turn("correction-demand", "No, I meant Demand Surge.");
  await turn("correction-investigate", "Investigate it.");

  await turn("typo-capacity", "Look at capcity.");
  await turn("typo-explain", "Explain it.");
  await turn("typo-scenario", "Show me the senarios.");
  await turn("typo-second", "Actually, the second one.");
  await turn("typo-decision", "Show me the desicion.");
  await turn("typo-investigate", "investigte it");

  await interaction("stage-overview", async () => {
    await clickTestId(page, "nexora-workspace-option-overview");
  });
  await turn("overview-stage", "What's on Stage?");
  await interaction("refresh", async () => {
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  });
  await turn("refresh-problems", "What problems do we have?");
  await turn("refresh-explicit", "Go back to Capacity Gap.");
  await turn("refresh-explain", "Explain it.");

  await turn("outcome-what", "What happened?");
  await turn("outcome-improve", "Did we improve?");
  await turn("outcome-cause", "Did the decision cause the improvement?");
  await turn("close-thanks", "Thanks. Give me the short version.");

  const byId = Object.fromEntries(live.managerTurns.map((row) => [row.id, row]));
  for (const [id, expected, anti] of [
    ["surge-explain", /Demand Surge/i, SUBJECT_STEAL],
    ["surge-return", /Demand Surge/i, SUBJECT_STEAL],
    ["surge-investigate", /Demand Surge/i, SUBJECT_STEAL],
    ["surge-deeper", /Demand Surge/i, SUBJECT_STEAL],
    ["surge-what-else", /Demand Surge/i, SUBJECT_STEAL],
    ["surge-sure", /Demand Surge/i, SUBJECT_STEAL],
    ["surge-impact", /Demand Surge/i, SUBJECT_STEAL],
    ["expansion-explicit", /Capacity Expansion Plan/i, null],
    ["surge-go-back", /Demand Surge/i, null],
    ["capacity-explain", /Capacity Gap/i, SUBJECT_STEAL],
    ["capacity-investigate", /Capacity Gap/i, SUBJECT_STEAL],
    ["capacity-post-click-explain", /Capacity Gap/i, SUBJECT_STEAL],
    ["capacity-post-click-more", /Capacity Gap/i, SUBJECT_STEAL],
    ["capacity-post-click-investigate", /Capacity Gap/i, SUBJECT_STEAL],
    ["correction-investigate", /Demand Surge/i, SUBJECT_STEAL],
    ["refresh-explain", /Capacity Gap/i, SUBJECT_STEAL],
  ]) {
    live.checks.push(textCheck(id, byId[id], expected, anti));
  }
  for (const [id, expected, anti] of [
    ["kpi-good-bad", /Capacity/i, /current scenario model|Demand Surge/i],
    ["risk-serious", /Risk/i, /Capacity Expansion Plan|Demand Surge/i],
    ["risk-unknown", /Risk/i, /condition of Demand Surge/i],
    ["risk-investigate", /Risk/i, /Capacity Expansion Plan|Demand Surge/i],
    ["recommend-ask", /Demand Surge/i, /recommend Capacity Expansion Plan/i],
  ]) {
    live.checks.push(textCheck(`fix3-${id}`, byId[id], expected, anti));
  }
  for (const [id, focused, referent] of [
    ["surge-investigate", "ctx-scenario-demand", "Demand Surge"],
    ["capacity-investigate", "ctx-problem-capacity", "Capacity Gap"],
    ["kpi-investigate", "obj-capacity", "Capacity"],
    ["risk-investigate", "obj-risk", "Risk"],
    ["correction-investigate", "ctx-scenario-demand", "Demand Surge"],
    ["refresh-explain", "ctx-problem-capacity", "Capacity Gap"],
  ]) {
    const row = byId[id];
    live.checks.push({
      id: `fix3-stage-advisor-${id}`,
      pass: row?.focused === focused && row?.moActive === focused && row?.nxaReferent === referent,
      expected: { focused, moActive: focused, nxaReferent: referent },
      actual: row
        ? { focused: row.focused, moActive: row.moActive, nxaReferent: row.nxaReferent }
        : null,
    });
  }
  live.checks.push(
    textCheck(
      "data-causal-honesty",
      byId["data-cause"],
      /not|cannot|doesn.t|uncertain|association|evidence|prove/i,
      /(?:definitely|conclusively) proves?/i,
    ),
  );
  live.checks.push(
    textCheck(
      "causal-surge-honesty",
      byId["causal-surge"],
      /not|cannot|uncertain|association|evidence|cause/i,
      /definitely caused/i,
    ),
  );
  live.checks.push({
    id: "preference-does-not-approve",
    pass:
      Number(byId["decision-preference"].canonicalApproved) ===
      Number(beforePreference.canonicalApproved),
    before: beforePreference.canonicalApproved,
    after: byId["decision-preference"].canonicalApproved,
  });
  live.checks.push({
    id: "explicit-approval-canonical",
    pass:
      Number(byId["decision-approve"].canonicalApproved) >
      Number(beforeApproval.canonicalApproved),
    before: beforeApproval.canonicalApproved,
    after: byId["decision-approve"].canonicalApproved,
  });
  live.checks.push({
    id: "execution-not-before-start",
    pass:
      Number(beforeStart.canonicalExecutions) ===
      Number(byId["execution-missing"].canonicalExecutions),
    before: beforeStart.canonicalExecutions,
    after: byId["execution-missing"].canonicalExecutions,
  });
  live.checks.push({
    id: "explicit-start-canonical",
    pass:
      Number(byId["execution-start"].canonicalExecutions) >
      Number(beforeStart.canonicalExecutions),
    before: beforeStart.canonicalExecutions,
    after: byId["execution-start"].canonicalExecutions,
  });
  live.checks.push({
    id: "mutation-interruption-does-not-change-decision-execution",
    pass:
      Number(byId["mutation-stale-yes"].canonicalApproved) ===
        Number(beforeMutation.canonicalApproved) &&
      Number(byId["mutation-stale-yes"].canonicalExecutions) ===
        Number(beforeMutation.canonicalExecutions),
    beforeApproved: beforeMutation.canonicalApproved,
    afterApproved: byId["mutation-stale-yes"].canonicalApproved,
    beforeExecutions: beforeMutation.canonicalExecutions,
    afterExecutions: byId["mutation-stale-yes"].canonicalExecutions,
  });

  live.longSessionTurns = live.managerTurns.length;
  live.leaks = live.managerTurns.filter((row) => row.leak);
  live.leakCount = live.leaks.length;
  live.failedChecks = live.checks.filter((item) => !item.pass);
  live.zeroPageErrors = pageErrors.length === 0;
  live.finishedAt = new Date().toISOString();

  await page.screenshot({
    path: join(out, "live-manager-session.png"),
    fullPage: true,
  });
  await browser.close();
  await writeFile(
    join(out, "live-manager-session.json"),
    JSON.stringify(live, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        identity: live.identity,
        managerTurns: live.longSessionTurns,
        pageErrors: pageErrors.length,
        leakCount: live.leakCount,
        checksPassed: live.checks.length - live.failedChecks.length,
        checksTotal: live.checks.length,
        failedChecks: live.failedChecks.map((item) => item.id),
        output: join(out, "live-manager-session.json"),
      },
      null,
      2,
    ),
  );
} finally {
  if (started.child) started.child.kill("SIGTERM");
}
