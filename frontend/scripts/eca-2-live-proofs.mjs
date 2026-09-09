/**
 * NPA-T ECA:2 live /executive proofs from the original phase prompt.
 * Reuses FINAL:3 chat helpers. Does not start ECA:3.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-2");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      nextAction: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      authority: shell?.getAttribute("data-eca-2-authority") ?? "none",
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      stageMode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
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
const compare = await turn(page, "Compare Scenario A and Scenario B.");
const lowerRisk = await turn(page, "Which has lower risk?");
const deliverySpeed = await turn(page, "What if delivery speed matters more?");
const runtime2 = pass(
  compare.intent === "COMPARE" &&
    [lowerRisk.intent, deliverySpeed.intent].every((intent) =>
      ["EVALUATE", "ASK_WHAT_IF", "COMPARE"].includes(intent),
    ) &&
    compare.authority !== "CC:10 Decision Commitment",
  { compare, lowerRisk, deliverySpeed },
);

await openExecutivePage(page, url);
const recommend = await turn(page, "What should I do about Capacity Gap?");
const runtime3 = pass(
  recommend.intent === "SEEK_RECOMMENDATION" &&
    recommend.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY",
  recommend,
);

await openExecutivePage(page, url);
await turn(page, "Explain Capacity Gap.");
const demand = await turn(page, "Now tell me about Demand Surge.");
const investigateIt = await turn(page, "Investigate it.");
const runtime4 = pass(
  demand.intent !== "UNKNOWN" &&
    (investigateIt.nextAction === "ASK_CLARIFICATION" || investigateIt.intent === "INVESTIGATE"),
  { demand, investigateIt },
);

await openExecutivePage(page, url);
const propose = await turn(page, "Add Supplier Delay as a Risk.");
const confirm = await turn(page, "Add it.");
const runtime5 = pass(
  propose.intent === "PROPOSE_CHANGE" &&
    /Add it/i.test(propose.reply ?? "") &&
    confirm.intent === "CONFIRM_ACTION" &&
    confirm.authority === "Canonical Risk Writer",
  { propose, confirm },
);

await openExecutivePage(page, url);
const capAvMeaning = await turn(page, "What does CAP_AV mean?");
const capAvWorry = await turn(page, "Should I worry about it?");
const runtime6 = pass(
  capAvMeaning.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
    capAvWorry.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
    !/confirmed for this source/i.test(`${capAvMeaning.reply ?? ""} ${capAvWorry.reply ?? ""}`),
  { capAvMeaning, capAvWorry },
);

await openExecutivePage(page, url);
await turn(page, "Compare Scenario A and Scenario B.");
const review = await turn(page, "What should I do?");
const runtime7 = pass(
  review.intent === "SEEK_RECOMMENDATION" &&
    review.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
    review.authority !== "CC:10 Decision Commitment",
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

const failed = Object.entries(proofs).filter(([, value]) => !value.pass).map(([id]) => id);
const report = {
  identity: "NPA-T ECA:2/LiveExecutiveProofs",
  url,
  errors,
  proofs,
  failed,
  zeroPageErrors: errors.length === 0,
  ok: failed.length === 0 && errors.length === 0,
};
await writeFile(join(out, "live-proofs.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
