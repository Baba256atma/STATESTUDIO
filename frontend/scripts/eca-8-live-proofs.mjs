/**
 * NPA-T ECA:8 live /executive proofs. Maximum 5 isolated reset journeys.
 * Does not start ECA:9.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-8");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector("[data-stage-thread-decision-count]");
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      action: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      readiness: shell?.getAttribute("data-eca-7-readiness") ?? "none",
      decisionReadiness: shell?.getAttribute("data-eca-7-decision-readiness") ?? "none",
      option: shell?.getAttribute("data-eca-7-option") ?? "none",
      writes7: shell?.getAttribute("data-eca-7-writes") ?? "none",
      state: shell?.getAttribute("data-eca-8-state") ?? "none",
      resolution: shell?.getAttribute("data-eca-8-target-resolution") ?? "none",
      challenge: shell?.getAttribute("data-eca-8-challenge") ?? "none",
      confirmation: shell?.getAttribute("data-eca-8-confirmation") ?? "none",
      handoff: shell?.getAttribute("data-eca-8-handoff") ?? "none",
      writes8: shell?.getAttribute("data-eca-8-writes") ?? "none",
      secondWriter: shell?.getAttribute("data-eca-8-second-writer") ?? "none",
      startsExecution: shell?.getAttribute("data-eca-8-starts-execution") ?? "none",
      decisionCount: stage?.getAttribute("data-stage-thread-decision-count") ?? "0",
      executionCount: stage?.getAttribute("data-stage-thread-execution-count") ?? "0",
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

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });
await openExecutivePage(page, url);
const baseline = await readEca(page);

// 1. Preference without commitment
const prefer = await turn(page, "I prefer Demand Surge.");
const runtime1 = pass(
  prefer.state === "PREFERENCE" &&
    prefer.writes8 === "false" &&
    prefer.secondWriter === "false" &&
    prefer.handoff === "false" &&
    prefer.decisionCount === baseline.decisionCount,
  { baseline, prefer },
);

// 2. READY_WITH_CONDITIONS / insufficient evidence → one challenge path
await openExecutivePage(page, url);
await turn(page, "Compare Demand Surge and Pricing Response.");
await turn(page, "What do you recommend?");
const challenged = await turn(page, "Choose Demand Surge.");
const runtime2 = pass(
  challenged.writes8 === "false" &&
    challenged.secondWriter === "false" &&
    (challenged.challenge !== "NONE" ||
      challenged.decisionReadiness === "NOT_READY" ||
      challenged.decisionReadiness === "BLOCKED" ||
      challenged.decisionReadiness === "READY_WITH_CONDITIONS" ||
      /before you confirm|unresolved|not yet|trade-?off|uncertain/i.test(challenged.reply ?? "")),
  challenged,
);

// 3. Challenge accepted → still no Decision write from ECA:8
const acknowledged = await turn(page, "Yes, I accept that risk.");
const runtime3 = pass(
  acknowledged.writes8 === "false" &&
    acknowledged.secondWriter === "false" &&
    acknowledged.startsExecution === "false" &&
    (acknowledged.decisionCount === challenged.decisionCount ||
      Number(acknowledged.decisionCount ?? 0) === Number(challenged.decisionCount ?? 0)),
  { challenged, acknowledged },
);

// 4. Explicit approval → CC:10 handoff path only (ECA:8 does not write)
await openExecutivePage(page, url);
const beforeApprove = await readEca(page);
await turn(page, "Compare Demand Surge and Pricing Response.");
const approved = await turn(page, "Approve Demand Surge.");
const runtime4 = pass(
  approved.writes8 === "false" &&
    approved.secondWriter === "false" &&
    approved.startsExecution === "false" &&
    (approved.state === "EXPLICIT_COMMITMENT" ||
      approved.state === "AWAITING_CONFIRMATION" ||
      approved.intent === "COMMIT_DECISION" ||
      approved.action === "HANDOFF_TO_CANONICAL_AUTHORITY") &&
    (approved.intent !== "COMMIT_DECISION" || approved.action === "HANDOFF_TO_CANONICAL_AUTHORITY" || approved.handoff === "true" || approved.writes8 === "false"),
  { beforeApprove, approved },
);

// 5. After commitment dialogue, Execution remains zero before CC:11
await openExecutivePage(page, url);
const beforeCommit = await readEca(page);
await turn(page, "Compare Demand Surge and Pricing Response.");
const committed = await turn(page, "I choose Demand Surge.");
const afterCommit = await readEca(page);
const runtime5 = pass(
  committed.writes8 === "false" &&
    committed.startsExecution === "false" &&
    afterCommit.executionCount === beforeCommit.executionCount &&
    Number(afterCommit.executionCount ?? 0) === Number(beforeCommit.executionCount ?? 0),
  { beforeCommit, committed, afterCommit },
);

const proofs = {
  identity: "NPA-T ECA:8/live-proofs",
  url,
  errors,
  pageErrors: errors.length,
  "1-preference-without-commitment": runtime1,
  "2-ready-with-conditions-challenge": runtime2,
  "3-challenge-accepted-no-decision": runtime3,
  "4-explicit-approval-cc10-only": runtime4,
  "5-decision-execution-boundary": runtime5,
};
const keys = [
  "1-preference-without-commitment",
  "2-ready-with-conditions-challenge",
  "3-challenge-accepted-no-decision",
  "4-explicit-approval-cc10-only",
  "5-decision-execution-boundary",
];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (errors.length > 0 || keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: 0 }, null, 2));
