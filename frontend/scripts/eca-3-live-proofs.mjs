/**
 * NPA-T ECA:3 live /executive proofs. Isolated reset journeys.
 * Does not start ECA:4.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-3");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      nextAction: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      authority: shell?.getAttribute("data-eca-2-authority") ?? "none",
      intervene: shell?.getAttribute("data-eca-3-intervene") ?? "none",
      reason: shell?.getAttribute("data-eca-3-reason") ?? "none",
      strength: shell?.getAttribute("data-eca-3-strength") ?? "none",
      suppression: shell?.getAttribute("data-eca-3-suppression") ?? "none",
      writes: shell?.getAttribute("data-eca-3-writes") ?? "none",
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

const silenceAsk = await turn(page, "Explain Demand Surge.");
const runtime1 = pass(
  silenceAsk.intent === "EXPLAIN" &&
    silenceAsk.intervene === "false" &&
    silenceAsk.writes === "false",
  silenceAsk,
);

await openExecutivePage(page, url);
const goal = await turn(
  page,
  "On-time delivery is at 91% against the 96% goal and getting worse. How are we doing?",
);
const runtime2 = pass(
  goal.intervene === "true" &&
    goal.reason === "GOAL_AT_RISK" &&
    goal.writes === "false" &&
    goal.authority !== "CC:10 Decision Commitment",
  goal,
);

await openExecutivePage(page, url);
const missing = await turn(page, "Compare Scenario A and Scenario B.");
const runtime3 = pass(
  missing.intent === "COMPARE" &&
    (missing.nextAction === "ASK_FOR_MISSING_INFORMATION" || missing.reason === "MISSING_CRITICAL_INFORMATION") &&
    missing.writes === "false",
  missing,
);

await openExecutivePage(page, url);
const firstRisk = await turn(
  page,
  "Supplier Delay has become more relevant to the delivery goal. How are we doing?",
);
const dismissed = await turn(page, "Not now.");
const continueAfter = await turn(page, "Explain Capacity Gap.");
const runtime4 = pass(
  firstRisk.intervene === "true" &&
    continueAfter.intent === "EXPLAIN" &&
    continueAfter.intervene === "false" &&
    continueAfter.writes === "false",
  { firstRisk, dismissed, continueAfter },
);

await openExecutivePage(page, url);
await turn(page, "Supplier Delay has become more relevant to the delivery goal. How are we doing?");
await turn(page, "Not now.");
const changed = await turn(
  page,
  "New confirmed evidence shows Supplier Delay is now blocking execution. How are we doing?",
);
const runtime5 = pass(
  changed.intervene === "true" &&
    (changed.reason === "RISK_ESCALATION" || /supplier delay/i.test(`${changed.reason} ${changed.reply ?? ""}`)) &&
    changed.writes === "false",
  changed,
);

await openExecutivePage(page, url);
const capAvMeaning = await turn(page, "What does CAP_AV mean?");
const capAvWorry = await turn(page, "Should I worry about it?");
const runtime6 = pass(
  capAvWorry.strength !== "WARN" &&
    !/available capacity has fallen dangerously/i.test(`${capAvMeaning.reply ?? ""} ${capAvWorry.reply ?? ""}`) &&
    capAvWorry.authority !== "CC:10 Decision Commitment",
  { capAvMeaning, capAvWorry },
);

await openExecutivePage(page, url);
const review = await turn(page, "What should I do about Capacity Gap?");
const runtime7 = pass(
  review.intent === "SEEK_RECOMMENDATION" &&
    review.writes === "false" &&
    review.authority !== "CC:10 Decision Commitment" &&
    review.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY",
  review,
);

const proofs = {
  identity: "NPA-T ECA:3/live-proofs",
  url,
  errors,
  "1-appropriate-silence": runtime1,
  "2-goal-risk": runtime2,
  "3-missing-information": runtime3,
  "4-dismissal": runtime4,
  "5-new-evidence-after-dismissal": runtime5,
  "6-data-uncertainty": runtime6,
  "7-decision-execution-boundary": runtime7,
};
const passed = Object.values(proofs).every((item) => item === proofs.identity || item === url || item === errors || item.pass !== false);
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (!runtime1.pass || !runtime2.pass || !runtime3.pass || !runtime4.pass || !runtime5.pass || !runtime6.pass || !runtime7.pass) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "7/7" }, null, 2));
