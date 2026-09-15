/**
 * NPA-T ECA:2 live /executive proofs from the original phase prompt.
 * ECA:2-RESUME-1: uses real canonical Scenario identities from the live workspace
 * (not fabricated Scenario A/B). Does not start ECA:3. Does not run a production build.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

/** Live workspace canonical Scenarios (from collection membership). */
const SCENARIO_1 = Object.freeze({
  id: "ctx-scenario-demand",
  name: "Demand Surge",
});
const SCENARIO_2 = Object.freeze({
  id: "ctx-scenario-pricing",
  name: "Pricing Response",
});

const out = join(process.cwd(), "artifacts/eca/ECA-2");

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

async function waitForHttp(url, attempts = 90) {
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

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      nextAction: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      authority: shell?.getAttribute("data-eca-2-authority") ?? "none",
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
      stageMode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      canonicalApproved:
        shell?.getAttribute("data-canonical-approved-decision-count") ?? "0",
      canonicalExecutions:
        shell?.getAttribute("data-canonical-execution-count") ?? "0",
    };
  });
}

async function turn(page, utterance) {
  const chat = await askExecutiveChat(page, utterance);
  const eca = await readEca(page);
  return { utterance, reply: chat.last, ...eca };
}

function pass(condition, actual) {
  return { pass: Boolean(condition), actual };
}

function mentionsBothScenarios(text) {
  const body = String(text ?? "");
  return (
    new RegExp(SCENARIO_1.name, "i").test(body) &&
    new RegExp(SCENARIO_2.name, "i").test(body)
  );
}

function notFoundReply(text) {
  return /couldn.?t find|no clear match|not found/i.test(String(text ?? ""));
}

function noDecisionCommit(row) {
  return (
    row.authority !== "CC:10 Decision Commitment" &&
    row.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
    Number(row.canonicalApproved ?? 0) === 0 &&
    !/is now the Approved decision|Decision committed|committed the Decision/i.test(
      String(row.reply ?? ""),
    )
  );
}

const started = { child: null };
let report;
try {
  let base = process.env.EXECUTIVE_URL ?? null;
  if (!base) {
    const port = await findFreePort();
    const child = spawn("npx", ["next", "start", "-H", "127.0.0.1", "-p", String(port)], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PORT: String(port) },
    });
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
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  await mkdir(out, { recursive: true });
  await openExecutivePage(page, url);

  // Discover live Scenario collection before Runtime 2.
  const scenariosShow = await turn(page, "Show me the scenarios.");
  const scenarioInventory = String(scenariosShow.reply ?? "");
  const hasScenario1 = new RegExp(SCENARIO_1.name, "i").test(scenarioInventory);
  const hasScenario2 = new RegExp(SCENARIO_2.name, "i").test(scenarioInventory);
  if (!hasScenario1 || !hasScenario2) {
    report = {
      identity: "NPA-T ECA:2/LiveExecutiveProofs",
      resume: "ECA:2-RESUME-1",
      url,
      environmentalBlocker: {
        reason: "Fewer than two valid canonical Scenarios available in live workspace",
        expectedSubjects: [SCENARIO_1, SCENARIO_2],
        inventoryReply: scenarioInventory.slice(0, 500),
      },
      errors,
      proofs: {},
      failed: ["2-compare"],
      zeroPageErrors: errors.length === 0,
      ok: false,
    };
    await writeFile(join(out, "live-proofs.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    process.exit(2);
  }

  await openExecutivePage(page, url);
  const explain = await turn(page, "Explain Capacity Gap.");
  const whyImportant = await turn(page, "Why is it important?");
  const evidence = await turn(page, "Show me the evidence.");
  const runtime1 = pass(
    explain.intent === "EXPLAIN" &&
      whyImportant.intent === "EXPLAIN" &&
      evidence.intent === "INSPECT_EVIDENCE" &&
      evidence.nextAction === "SHOW_EVIDENCE" &&
      explain.stageMode === "overview",
    { explain, whyImportant, evidence },
  );

  await openExecutivePage(page, url);
  const compareUtterance = `Compare ${SCENARIO_1.name} and ${SCENARIO_2.name}.`;
  const compare = await turn(page, compareUtterance);
  const lowerRisk = await turn(page, "Which has lower risk?");
  const deliverySpeed = await turn(page, "What if delivery speed matters more?");
  const runtime2 = pass(
    compare.intent === "COMPARE" &&
      !notFoundReply(compare.reply) &&
      (mentionsBothScenarios(compare.reply) ||
        mentionsBothScenarios(`${lowerRisk.reply} ${deliverySpeed.reply}`)) &&
      ["EVALUATE", "ASK_WHAT_IF", "COMPARE"].includes(lowerRisk.intent) &&
      ["EVALUATE", "ASK_WHAT_IF", "COMPARE"].includes(deliverySpeed.intent) &&
      /risk|lower/i.test(`${lowerRisk.reply} ${lowerRisk.intent}`) &&
      /deliver|speed|what if|trade/i.test(`${deliverySpeed.reply} ${deliverySpeed.intent}`) &&
      compare.authority !== "CC:10 Decision Commitment" &&
      noDecisionCommit(compare) &&
      noDecisionCommit(lowerRisk) &&
      noDecisionCommit(deliverySpeed) &&
      // Stage focus must not hijack the comparison thread into a single unrelated subject.
      ![compare.focused, lowerRisk.focused, deliverySpeed.focused].some(
        (id) => id && id !== "none" && ![SCENARIO_1.id, SCENARIO_2.id].includes(id),
      ),
    {
      comparisonSubjects: [SCENARIO_1, SCENARIO_2],
      compare,
      lowerRisk,
      deliverySpeed,
    },
  );

  await openExecutivePage(page, url);
  const recommend = await turn(page, "What should I do about Capacity Gap?");
  const runtime3 = pass(
    (recommend.intent === "SEEK_RECOMMENDATION" ||
      recommend.nextAction === "RECOMMEND_INVESTIGATION" ||
      recommend.nextAction === "ASK_FOR_MISSING_INFORMATION" ||
      recommend.nextAction === "SHOW_UNCERTAINTY") &&
      recommend.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
      noDecisionCommit(recommend),
    recommend,
  );

  await openExecutivePage(page, url);
  const firstRef = await turn(page, `Explain ${SCENARIO_1.name}.`);
  const secondRef = await turn(page, `Now tell me about ${SCENARIO_2.name}.`);
  const investigateIt = await turn(page, "Investigate it.");
  const runtime4 = pass(
    firstRef.intent !== "UNKNOWN" &&
      secondRef.intent !== "UNKNOWN" &&
      !notFoundReply(firstRef.reply) &&
      !notFoundReply(secondRef.reply) &&
      (investigateIt.nextAction === "ASK_CLARIFICATION" ||
        investigateIt.intent === "INVESTIGATE") &&
      investigateIt.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
      Number(investigateIt.canonicalApproved ?? 0) === 0 &&
      Number(investigateIt.canonicalExecutions ?? 0) === 0,
    { firstRef, secondRef, investigateIt },
  );

  await openExecutivePage(page, url);
  const propose = await turn(page, "Add Supplier Delay as a Risk.");
  const whyProposal = await turn(page, "Why?");
  const confirm = await turn(page, "Add it.");
  const runtime5 = pass(
    propose.intent === "PROPOSE_CHANGE" &&
      /Add it/i.test(propose.reply ?? "") &&
      whyProposal.intent !== "UNKNOWN" &&
      // Explanatory follow-up must not detach the bound confirmation path.
      confirm.intent === "CONFIRM_ACTION" &&
      confirm.authority === "Canonical Risk Writer" &&
      /Supplier Delay/i.test(confirm.reply ?? "") &&
      /added|Risk/i.test(confirm.reply ?? ""),
    { propose, whyProposal, confirm },
  );

  await openExecutivePage(page, url);
  const capAvMeaning = await turn(page, "What does CAP_AV mean?");
  const capAvWorry = await turn(page, "Should I worry about it?");
  const runtime6 = pass(
    capAvMeaning.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
      capAvWorry.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
      !/confirmed for this source|definitely means|is exactly/i.test(
        `${capAvMeaning.reply ?? ""} ${capAvWorry.reply ?? ""}`,
      ) &&
      Number(capAvWorry.canonicalApproved ?? 0) === 0,
    { capAvMeaning, capAvWorry },
  );

  await openExecutivePage(page, url);
  await turn(page, compareUtterance);
  const review = await turn(page, "What should I do?");
  const runtime7 = pass(
    (review.intent === "SEEK_RECOMMENDATION" ||
      review.nextAction === "RECOMMEND_INVESTIGATION" ||
      review.nextAction === "ASK_FOR_MISSING_INFORMATION") &&
      review.intent !== "COMMIT_DECISION" &&
      review.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
      review.authority !== "CC:10 Decision Commitment" &&
      noDecisionCommit(review),
    review,
  );

  const proofs = {
    "1-understand-investigate": runtime1,
    "2-compare": runtime2,
    "3-recommendation": runtime3,
    "4-ambiguity": runtime4,
    "5-mutation": runtime5,
    "6-data": runtime6,
    "7-decision-boundary": runtime7,
  };

  await page.screenshot({ path: join(out, "live-proofs.png") });
  await browser.close();

  const failed = Object.entries(proofs)
    .filter(([, value]) => !value.pass)
    .map(([id]) => id);
  report = {
    identity: "NPA-T ECA:2/LiveExecutiveProofs",
    resume: "ECA:2-RESUME-1",
    url,
    comparisonSubjects: [SCENARIO_1, SCENARIO_2],
    scenarioInventory: scenarioInventory.slice(0, 500),
    errors,
    proofs,
    failed,
    zeroPageErrors: errors.length === 0,
    ok: failed.length === 0 && errors.length === 0,
  };
  await writeFile(join(out, "live-proofs.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exit(1);
} finally {
  if (started.child && !started.child.killed) {
    started.child.kill("SIGTERM");
  }
}
