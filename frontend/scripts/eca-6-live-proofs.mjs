/**
 * NPA-T ECA:6 live /executive proofs. Isolated reset journeys.
 * Does not start ECA:7.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-6");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      eca1: Boolean(shell?.getAttribute("data-eca-2-engine")),
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      action: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      intervene: shell?.getAttribute("data-eca-3-intervene") ?? "none",
      ask: shell?.getAttribute("data-eca-4-ask") ?? "none",
      bound: shell?.getAttribute("data-eca-5-bound") ?? "none",
      intakeType: shell?.getAttribute("data-eca-5-type") ?? "none",
      writes5: shell?.getAttribute("data-eca-5-writes") ?? "none",
      objective: shell?.getAttribute("data-eca-6-objective") ?? "none",
      lifecycle: shell?.getAttribute("data-eca-6-lifecycle") ?? "none",
      relation: shell?.getAttribute("data-eca-6-relation") ?? "none",
      milestone: shell?.getAttribute("data-eca-6-milestone") ?? "none",
      currentMilestone: shell?.getAttribute("data-eca-6-current-milestone") ?? "none",
      returnTo: shell?.getAttribute("data-eca-6-return") ?? "none",
      writes6: shell?.getAttribute("data-eca-6-writes") ?? "none",
      secondStore: shell?.getAttribute("data-eca-6-second-store") ?? "none",
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

const late = await turn(page, "Why are deliveries late?");
const evidence = await turn(page, "Show me the evidence.");
const capacity = await turn(page, "What about Capacity Gap?");
const runtime1 = pass(
  late.objective === "INVESTIGATE_ISSUE" &&
    evidence.objective === "INVESTIGATE_ISSUE" &&
    capacity.objective === "INVESTIGATE_ISSUE" &&
    capacity.writes6 === "false" &&
    capacity.secondStore === "false",
  { late, evidence, capacity },
);

await openExecutivePage(page, url);
await turn(page, "Compare outsourcing and overtime.");
const side = await turn(page, "What does CAP_AV mean?");
const runtime2 = pass(
  side.relation === "SIDE_QUESTION" &&
    side.objective === "COMPARE_OPTIONS" &&
    side.writes6 === "false",
  side,
);

const afterSide = await turn(page, "Which issue should we investigate first?");
const runtime3 = pass(
  afterSide.objective !== "none" &&
    afterSide.lifecycle !== "ABANDONED" &&
    afterSide.secondStore === "false",
  afterSide,
);

await openExecutivePage(page, url);
await turn(page, "Why are deliveries late?");
const switched = await turn(page, "Forget delivery. Show current Executions.");
const runtime4 = pass(
  switched.relation === "SWITCH" &&
    switched.returnTo === "false" &&
    switched.writes6 === "false",
  switched,
);

await openExecutivePage(page, url);
await turn(page, "Compare outsourcing and overtime.");
await turn(page, "Which has lower risk?");
const recommend = await turn(page, "What do you recommend?");
const runtime5 = pass(
  (recommend.objective === "COMPARE_OPTIONS" ||
    recommend.objective === "PREPARE_RECOMMENDATION") &&
    recommend.intent !== "COMMIT_DECISION" &&
    recommend.writes6 === "false",
  recommend,
);

await openExecutivePage(page, url);
await turn(page, "Compare Supplier A and Supplier B.");
const estimate = await turn(page, "Around 40k.");
const runtime6 = pass(
  estimate.writes6 === "false" &&
    estimate.writes5 === "false" &&
    estimate.secondStore === "false",
  estimate,
);

await openExecutivePage(page, url);
await turn(page, "Compare A and B.");
const choose = await turn(page, "I choose A.");
const runtime7 = pass(
  choose.writes6 === "false" &&
    choose.secondStore === "false" &&
    (choose.intent !== "COMMIT_DECISION" ||
      choose.action === "HANDOFF_TO_CANONICAL_AUTHORITY") &&
    choose.lifecycle !== "COMPLETED",
  choose,
);

const proofs = {
  identity: "NPA-T ECA:6/live-proofs",
  url,
  errors,
  "1-investigation-continuity": runtime1,
  "2-side-question": runtime2,
  "3-return": runtime3,
  "4-explicit-switch": runtime4,
  "5-comparison-recommendation": runtime5,
  "6-information-gap-progress": runtime6,
  "7-decision-execution-boundary": runtime7,
};
const keys = [
  "1-investigation-continuity",
  "2-side-question",
  "3-return",
  "4-explicit-switch",
  "5-comparison-recommendation",
  "6-information-gap-progress",
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
