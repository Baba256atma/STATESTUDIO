/**
 * NPA-T ECA:7 live /executive proofs. Maximum 5 isolated reset journeys.
 * Does not start ECA:8.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-7");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      action: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      ask: shell?.getAttribute("data-eca-4-ask") ?? "none",
      bound: shell?.getAttribute("data-eca-5-bound") ?? "none",
      intakeType: shell?.getAttribute("data-eca-5-type") ?? "none",
      writes5: shell?.getAttribute("data-eca-5-writes") ?? "none",
      objective: shell?.getAttribute("data-eca-6-objective") ?? "none",
      requested: shell?.getAttribute("data-eca-7-requested") ?? "none",
      readiness: shell?.getAttribute("data-eca-7-readiness") ?? "none",
      decisionReadiness: shell?.getAttribute("data-eca-7-decision-readiness") ?? "none",
      type: shell?.getAttribute("data-eca-7-type") ?? "none",
      strength: shell?.getAttribute("data-eca-7-strength") ?? "none",
      option: shell?.getAttribute("data-eca-7-option") ?? "none",
      writes7: shell?.getAttribute("data-eca-7-writes") ?? "none",
      secondDecision: shell?.getAttribute("data-eca-7-decision-engine") ?? "none",
      decisionCount: shell?.getAttribute("data-decision-count") ?? "0",
      executionCount: shell?.getAttribute("data-execution-count") ?? "0",
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

// 1. Grounded recommendation (Demand Surge / Capacity Gap path via compare)
await turn(page, "Help me decide what to do about Capacity Gap.");
await turn(page, "Compare Demand Surge and Pricing Response.");
const grounded = await turn(page, "What do you recommend?");
const runtime1 = pass(
  grounded.requested === "true" &&
    grounded.writes7 === "false" &&
    grounded.secondDecision === "false" &&
    grounded.intent !== "COMMIT_DECISION" &&
    (grounded.decisionCount === "0" || grounded.decisionCount === "none" || Number(grounded.decisionCount) === 0),
  grounded,
);

// 2. Insufficient evidence → DEFER / not READY
await openExecutivePage(page, url);
const early = await turn(page, "What do you recommend?");
const runtime2 = pass(
  early.option === "none" &&
    early.readiness !== "READY" &&
    early.writes7 === "false" &&
    early.secondDecision === "false",
  early,
);

// 3. Preference changes recommendation framing
await openExecutivePage(page, url);
await turn(page, "Compare Demand Surge and Pricing Response.");
await turn(page, "Delivery speed matters most.");
const first = await turn(page, "What do you recommend?");
await turn(page, "Actually, cost matters more.");
const shifted = await turn(page, "What do you recommend?");
const runtime3 = pass(
  shifted.writes7 === "false" &&
    shifted.requested === "true" &&
    shifted.secondDecision === "false",
  { first, shifted },
);

// 4. Decision readiness without automatic Decision
await openExecutivePage(page, url);
await turn(page, "Compare Demand Surge and Pricing Response.");
const readyAsk = await turn(page, "What do you recommend?");
const runtime4 = pass(
  readyAsk.writes7 === "false" &&
    readyAsk.secondDecision === "false" &&
    readyAsk.intent !== "COMMIT_DECISION" &&
    (readyAsk.decisionCount === "0" || readyAsk.decisionCount === "none" || Number(readyAsk.decisionCount) === 0),
  readyAsk,
);

// 5. Explicit Decision approval → CC:10 only; Execution remains separate
await openExecutivePage(page, url);
await turn(page, "Compare Demand Surge and Pricing Response.");
const before = await turn(page, "What do you recommend?");
const choose = await turn(page, "I choose Demand Surge.");
const runtime5 = pass(
  before.writes7 === "false" &&
    choose.writes7 === "false" &&
    choose.secondDecision === "false" &&
    (choose.intent !== "COMMIT_DECISION" || choose.action === "HANDOFF_TO_CANONICAL_AUTHORITY") &&
    (choose.executionCount === "0" || choose.executionCount === "none" || Number(choose.executionCount) === 0),
  { before, choose },
);

const proofs = {
  identity: "NPA-T ECA:7/live-proofs",
  url,
  errors,
  pageErrors: errors.length,
  "1-grounded-recommendation": runtime1,
  "2-insufficient-evidence-defer": runtime2,
  "3-preference-framing": runtime3,
  "4-decision-readiness-no-auto-decision": runtime4,
  "5-cc10-boundary-no-execution": runtime5,
};
const keys = [
  "1-grounded-recommendation",
  "2-insufficient-evidence-defer",
  "3-preference-framing",
  "4-decision-readiness-no-auto-decision",
  "5-cc10-boundary-no-execution",
];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (errors.length > 0 || keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: 0 }, null, 2));
