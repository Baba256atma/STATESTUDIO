/**
 * NPA-T ECA:7 live /executive proofs. Isolated reset journeys.
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

await turn(page, "Compare outsourcing and overtime.");
const rec = await turn(page, "What do you recommend?");
const runtime1 = pass(
  rec.requested === "true" &&
    rec.writes7 === "false" &&
    rec.secondDecision === "false" &&
    rec.intent !== "COMMIT_DECISION",
  rec,
);

await openExecutivePage(page, url);
const early = await turn(page, "What do you recommend?");
const runtime2 = pass(
  early.option === "none" &&
    early.readiness !== "READY" &&
    early.writes7 === "false",
  early,
);

await openExecutivePage(page, url);
await turn(page, "Compare Supplier A and Supplier B.");
const gap = await turn(page, "What do you recommend?");
const runtime3 = pass(
  gap.writes7 === "false" &&
    gap.secondDecision === "false" &&
    (gap.type === "DEFER_DECISION" ||
      gap.readiness === "BLOCKED_BY_CRITICAL_UNKNOWN" ||
      gap.type === "NO_CLEAR_PREFERENCE" ||
      gap.type === "CONDITIONAL_PREFERENCE" ||
      gap.type === "PREFER_OPTION" ||
      gap.type === "CONTINUE_INVESTIGATION"),
  gap,
);

await openExecutivePage(page, url);
await turn(page, "Compare Supplier A and Supplier B.");
const estimate = await turn(page, "Around 40k.");
const afterEstimate = await turn(page, "What do you recommend?");
const runtime4 = pass(
  afterEstimate.writes7 === "false" &&
    afterEstimate.writes5 === "false" &&
    afterEstimate.strength !== "STRONG",
  { estimate, afterEstimate },
);

await openExecutivePage(page, url);
await turn(page, "Compare outsourcing and overtime.");
await turn(page, "Delivery speed matters most.");
const first = await turn(page, "What do you recommend?");
await turn(page, "Actually, cost matters more.");
const shifted = await turn(page, "What do you recommend?");
const runtime5 = pass(
  shifted.writes7 === "false" &&
    shifted.requested === "true" &&
    shifted.secondDecision === "false",
  { first, shifted },
);

await openExecutivePage(page, url);
await turn(page, "Should I worry about CAP_AV?");
const cap = await turn(page, "What do you recommend?");
const runtime6 = pass(
  cap.writes7 === "false" &&
    cap.strength !== "STRONG",
  cap,
);

await openExecutivePage(page, url);
await turn(page, "Compare outsourcing and overtime.");
const before = await turn(page, "What do you recommend?");
const choose = await turn(page, "I choose A.");
const runtime7 = pass(
  before.writes7 === "false" &&
    choose.writes7 === "false" &&
    choose.secondDecision === "false" &&
    (choose.intent !== "COMMIT_DECISION" || choose.action === "HANDOFF_TO_CANONICAL_AUTHORITY"),
  { before, choose },
);

const proofs = {
  identity: "NPA-T ECA:7/live-proofs",
  url,
  errors,
  "1-supported-recommendation": runtime1,
  "2-too-early": runtime2,
  "3-critical-gap": runtime3,
  "4-estimate": runtime4,
  "5-criterion-shift": runtime5,
  "6-cap-av": runtime6,
  "7-recommendation-decision-boundary": runtime7,
};
const keys = [
  "1-supported-recommendation",
  "2-too-early",
  "3-critical-gap",
  "4-estimate",
  "5-criterion-shift",
  "6-cap-av",
  "7-recommendation-decision-boundary",
];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "7/7" }, null, 2));
