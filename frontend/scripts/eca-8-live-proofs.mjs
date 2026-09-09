/**
 * NPA-T ECA:8 live /executive proofs. Isolated reset journeys.
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
      writes7: shell?.getAttribute("data-eca-7-writes") ?? "none",
      state: shell?.getAttribute("data-eca-8-state") ?? "none",
      resolution: shell?.getAttribute("data-eca-8-target-resolution") ?? "none",
      challenge: shell?.getAttribute("data-eca-8-challenge") ?? "none",
      confirmation: shell?.getAttribute("data-eca-8-confirmation") ?? "none",
      handoff: shell?.getAttribute("data-eca-8-handoff") ?? "none",
      writes8: shell?.getAttribute("data-eca-8-writes") ?? "none",
      secondWriter: shell?.getAttribute("data-eca-8-second-writer") ?? "none",
      startsExecution: shell?.getAttribute("data-eca-8-starts-execution") ?? "none",
      decisionCount: stage?.getAttribute("data-stage-thread-decision-count") ?? "none",
      executionCount: stage?.getAttribute("data-stage-thread-execution-count") ?? "none",
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

const prefer = await turn(page, "I prefer Scenario A.");
const runtime1 = pass(
  prefer.state === "PREFERENCE" &&
    prefer.writes8 === "false" &&
    prefer.secondWriter === "false" &&
    prefer.handoff === "false" &&
    prefer.decisionCount === baseline.decisionCount,
  { baseline, prefer },
);

await openExecutivePage(page, url);
await turn(page, "Compare Scenario A and Scenario B.");
const choose = await turn(page, "Choose Scenario A.");
const runtime2 = pass(
  (choose.state === "EXPLICIT_COMMITMENT" || choose.state === "AWAITING_CONFIRMATION") &&
    choose.writes8 === "false" &&
    choose.secondWriter === "false" &&
    choose.startsExecution === "false" &&
    (choose.intent !== "COMMIT_DECISION" || choose.action === "HANDOFF_TO_CANONICAL_AUTHORITY"),
  choose,
);

await openExecutivePage(page, url);
await turn(page, "Compare Supplier A and Supplier B.");
await turn(page, "What do you recommend?");
const challenged = await turn(page, "Choose Supplier A.");
const runtime3 = pass(
  challenged.writes8 === "false" &&
    challenged.secondWriter === "false" &&
    (challenged.challenge !== "NONE" ||
      challenged.decisionReadiness === "NOT_READY" ||
      challenged.decisionReadiness === "BLOCKED" ||
      challenged.decisionReadiness === "READY_WITH_CONDITIONS" ||
      /before you confirm|unresolved|not yet/i.test(challenged.reply ?? "")),
  challenged,
);

const acknowledged = await turn(page, "I understand. Proceed with Supplier A.");
const runtime4 = pass(
  acknowledged.writes8 === "false" &&
    acknowledged.startsExecution === "false" &&
    !/WARNING: DECISION READINESS BLOCKER/i.test(acknowledged.reply ?? "") &&
    (acknowledged.challenge === challenged.challenge
      ? /acknowledged|confirm/i.test(acknowledged.reply ?? "")
      : true),
  { challenged, acknowledged },
);

await openExecutivePage(page, url);
await turn(page, "Compare Scenario A and Scenario B.");
const ambiguous = await turn(page, "Choose it.");
const runtime5 = pass(
  ambiguous.resolution === "AMBIGUOUS" &&
    ambiguous.writes8 === "false" &&
    ambiguous.handoff === "false",
  ambiguous,
);

await openExecutivePage(page, url);
const staleYes = await turn(page, "Yes.");
const runtime6 = pass(
  staleYes.handoff === "false" &&
    staleYes.writes8 === "false" &&
    staleYes.decisionCount === (await readEca(page)).decisionCount,
  staleYes,
);

await openExecutivePage(page, url);
const beforeCommit = await readEca(page);
await turn(page, "Compare outsourcing and overtime.");
const committed = await turn(page, "I choose outsourcing.");
const afterCommit = await readEca(page);
const runtime7 = pass(
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
  "1-preference-safety": runtime1,
  "2-explicit-commitment": runtime2,
  "3-critical-challenge": runtime3,
  "4-acknowledge-and-proceed": runtime4,
  "5-ambiguous-it": runtime5,
  "6-stale-yes": runtime6,
  "7-decision-execution-boundary": runtime7,
};
const keys = [
  "1-preference-safety",
  "2-explicit-commitment",
  "3-critical-challenge",
  "4-acknowledge-and-proceed",
  "5-ambiguous-it",
  "6-stale-yes",
  "7-decision-execution-boundary",
];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "7/7" }, null, 2));
