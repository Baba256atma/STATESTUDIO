/**
 * NPA-T ECA:5 live /executive proofs (short set, max 5).
 * Uses canonical catalog names. Does not start ECA:6.
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
      nextAction: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      authority: shell?.getAttribute("data-eca-2-authority") ?? "none",
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
      decisions: shell?.getAttribute("data-canonical-decision-count") ?? "0",
      executions: shell?.getAttribute("data-canonical-execution-count") ?? "0",
      risks: shell?.getAttribute("data-canonical-risk-count") ?? "0",
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
await turn(page, "Compare Demand Surge and Pricing Response.");
await turn(page, "Which should I choose?");
const prefer = await turn(page, "Delivery speed matters more.");
const recommend = await turn(page, "What do you recommend now?");
const runtime1 = pass(
  prefer.writes === "false" &&
    recommend.writes === "false" &&
    Number(prefer.decisions ?? "0") === 0 &&
    Number(recommend.decisions ?? "0") === 0 &&
    recommend.intent !== "COMMIT_DECISION",
  { prefer, recommend },
);

await openExecutivePage(page, url);
await turn(page, "Should I worry about CAP_AV?");
const capAv = await turn(page, "I think it means Available Capacity.");
const runtime2 = pass(
  capAv.writes === "false" &&
    capAv.confidence !== "CONFIRMED_BY_MANAGER" &&
    !/available capacity is confirmed/i.test(capAv.reply ?? ""),
  capAv,
);

await openExecutivePage(page, url);
await turn(page, "What is Supplier B's available capacity?");
const unknown = await turn(page, "I don't know.");
const runtime3 = pass(
  (unknown.type === "UNKNOWN" || /don't know|unknown|uncertain/i.test(unknown.reply ?? "")) &&
    unknown.writes === "false" &&
    !/supplier b['’]s current available capacity\?/i.test(unknown.reply ?? ""),
  unknown,
);

await openExecutivePage(page, url);
const propose = await turn(page, "Add Supplier Delay as a Risk.");
const why = await turn(page, "Why?");
const add = await turn(page, "Add it.");
const runtime4 = pass(
  propose.writes === "false" &&
    why.writes === "false" &&
    add.writes === "false" &&
    Number(add.risks ?? "0") <= 1,
  { propose, why, add },
);

await openExecutivePage(page, url);
await turn(page, "What should I do about Capacity Gap?");
const preference = await turn(page, "I prefer Demand Surge.");
const ready = await turn(page, "Are we ready to execute?");
const yes = await turn(page, "Yes.");
const start = await turn(page, "Start the plan.");
const runtime5 = pass(
  preference.writes === "false" &&
    Number(preference.decisions ?? "0") === 0 &&
    yes.writes === "false" &&
    Number(yes.executions ?? "0") === 0 &&
    start.writes === "false" &&
    Number(start.executions ?? "0") === 0 &&
    !/\bis running\b/i.test(`${yes.reply ?? ""} ${start.reply ?? ""}`),
  { preference, ready, yes, start },
);

const proofs = {
  identity: "NPA-T ECA:5/live-proofs",
  resume: "ECA:5-2026-09-14",
  url,
  comparisonSubjects: [
    { id: "ctx-scenario-demand", name: "Demand Surge" },
    { id: "ctx-scenario-pricing", name: "Pricing Response" },
  ],
  errors,
  "1-preference-recommendation-continuity": runtime1,
  "2-cap-av-uncertain-semantic-path": runtime2,
  "3-i-dont-know": runtime3,
  "4-risk-proposal-why-add": runtime4,
  "5-decision-execution-boundary": runtime5,
};

const allPass = [runtime1, runtime2, runtime3, runtime4, runtime5].every((item) => item.pass);
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (!allPass || errors.length > 0) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: errors.length }, null, 2));
