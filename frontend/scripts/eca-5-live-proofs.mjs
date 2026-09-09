/**
 * NPA-T ECA:5 live /executive proofs. Isolated reset journeys.
 * Does not start ECA:6.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-5");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      eca4Ask: shell?.getAttribute("data-eca-4-ask") ?? "none",
      bound: shell?.getAttribute("data-eca-5-bound") ?? "none",
      type: shell?.getAttribute("data-eca-5-type") ?? "none",
      complete: shell?.getAttribute("data-eca-5-complete") ?? "none",
      confidence: shell?.getAttribute("data-eca-5-confidence") ?? "none",
      conflict: shell?.getAttribute("data-eca-5-conflict") ?? "none",
      action: shell?.getAttribute("data-eca-5-action") ?? "none",
      need: shell?.getAttribute("data-eca-5-need") ?? "none",
      writes: shell?.getAttribute("data-eca-5-writes") ?? "none",
      staleYes: shell?.getAttribute("data-eca-5-stale-yes") ?? "none",
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

await turn(page, "What is Supplier B's lead time?");
const fact = await turn(page, "6 weeks.");
const runtime1 = pass(
  fact.bound === "true" &&
    fact.type === "FACT_CLAIM" &&
    fact.writes === "false",
  fact,
);

await openExecutivePage(page, url);
await turn(page, "What is Supplier B's expected cost?");
const estimate = await turn(page, "Probably around $40,000.");
const runtime2 = pass(
  estimate.type === "ESTIMATE" &&
    estimate.confidence === "ESTIMATED" &&
    estimate.writes === "false",
  estimate,
);

await openExecutivePage(page, url);
await turn(page, "What are Supplier B's cost and lead time?");
const partial = await turn(page, "Cost is 40k.");
const runtime3 = pass(
  partial.complete === "PARTIAL" &&
    partial.need === "PARTIALLY_SATISFIED" &&
    partial.writes === "false",
  partial,
);

await openExecutivePage(page, url);
await turn(page, "What is Supplier B's available capacity?");
const unknown = await turn(page, "I don't know.");
const runtime4 = pass(
  unknown.type === "UNKNOWN" &&
    unknown.writes === "false" &&
    !/supplier b['’]s current available capacity\?/i.test(unknown.reply ?? ""),
  unknown,
);

await openExecutivePage(page, url);
await turn(page, "Supplier B's lead time in our data is 4 weeks.");
await turn(page, "What is Supplier B's lead time?");
const conflict = await turn(page, "6 weeks.");
const runtime5 = pass(
  conflict.conflict === "VALUE_CONFLICT" &&
    conflict.writes === "false" &&
    /4 weeks/i.test(conflict.reply ?? ""),
  conflict,
);

await openExecutivePage(page, url);
await turn(page, "Should I worry about CAP_AV?");
const capAv = await turn(page, "Yes.");
const runtime6 = pass(
  capAv.writes === "false" &&
    (capAv.action === "HANDOFF_TO_EXISTING_WRITER" ||
      capAv.staleYes === "true" ||
      capAv.type === "CONFIRMATION"),
  capAv,
);

await openExecutivePage(page, url);
await turn(page, "Which scenario do you choose?");
const decision = await turn(page, "Scenario A.");
const runtime7 = pass(
  decision.writes === "false" &&
    decision.intent !== "COMMIT_DECISION",
  decision,
);

const proofs = {
  identity: "NPA-T ECA:5/live-proofs",
  url,
  errors,
  "1-fact-intake": runtime1,
  "2-estimate": runtime2,
  "3-partial": runtime3,
  "4-i-dont-know": runtime4,
  "5-conflict": runtime5,
  "6-cap-av": runtime6,
  "7-decision-boundary": runtime7,
};
const keys = ["1-fact-intake", "2-estimate", "3-partial", "4-i-dont-know", "5-conflict", "6-cap-av", "7-decision-boundary"];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "7/7" }, null, 2));
