/**
 * NPA-T ECA:4 live /executive proofs. Isolated reset journeys.
 * Does not start ECA:5.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-4");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      nextAction: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      authority: shell?.getAttribute("data-eca-2-authority") ?? "none",
      intervene: shell?.getAttribute("data-eca-3-intervene") ?? "none",
      action: shell?.getAttribute("data-eca-4-action") ?? "none",
      ask: shell?.getAttribute("data-eca-4-ask") ?? "none",
      type: shell?.getAttribute("data-eca-4-type") ?? "none",
      status: shell?.getAttribute("data-eca-4-status") ?? "none",
      necessity: shell?.getAttribute("data-eca-4-necessity") ?? "none",
      source: shell?.getAttribute("data-eca-4-source") ?? "none",
      writes: shell?.getAttribute("data-eca-4-writes") ?? "none",
      secondClarify: shell?.getAttribute("data-eca-4-clarify-engine") ?? "none",
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

const known = await turn(
  page,
  "The on-time delivery target is 96%. Compare Scenario A and Scenario B using the on-time delivery target.",
);
const runtime1 = pass(
  known.ask === "false" &&
    known.action === "NO_ACQUISITION_NEEDED" &&
    known.writes === "false" &&
    !/what is (?:the |your )?delivery target/i.test(known.reply ?? ""),
  known,
);

await openExecutivePage(page, url);
const cheaper = await turn(page, "Which scenario is cheaper?");
const runtime2 = pass(
  cheaper.type === "COST" &&
    cheaper.status === "MISSING" &&
    cheaper.writes === "false" &&
    cheaper.secondClarify === "false" &&
    /cost/i.test(`${cheaper.reply ?? ""} ${cheaper.action}`),
  cheaper,
);

await openExecutivePage(page, url);
await turn(page, "What is Supplier B's available capacity?");
const unknown = await turn(page, "I don't know.");
const runtime3 = pass(
  unknown.ask === "false" &&
    unknown.writes === "false" &&
    !/supplier b['’]s current available capacity\?/i.test(unknown.reply ?? ""),
  unknown,
);

await openExecutivePage(page, url);
await turn(page, "Which scenario is cheaper?");
const why = await turn(page, "Why do you need that?");
const runtime4 = pass(
  /compar|cost/i.test(why.reply ?? "") &&
    why.ask === "false" &&
    why.writes === "false",
  why,
);

await openExecutivePage(page, url);
await turn(page, "Do you know Supplier B's lead time?");
const skipped = await turn(page, "Not now.");
const proceed = await turn(page, "Compare the scenarios anyway.");
const runtime5 = pass(
  skipped.action === "DEFER" &&
    proceed.ask === "false" &&
    proceed.writes === "false",
  { skipped, proceed },
);

await openExecutivePage(page, url);
const capAv = await turn(page, "Should I worry about CAP_AV?");
const runtime6 = pass(
  capAv.status === "KNOWN_UNCONFIRMED" &&
    capAv.status !== "MISSING" &&
    capAv.action === "REQUEST_SEMANTIC_CONFIRMATION" &&
    capAv.writes === "false" &&
    capAv.authority !== "CC:10 Decision Commitment",
  capAv,
);

await openExecutivePage(page, url);
const start = await turn(page, "Start the plan.");
const runtime7 = pass(
  start.type === "PREREQUISITE" &&
    start.writes === "false" &&
    start.authority !== "CC:11 Execution Follow-up",
  start,
);

const proofs = {
  identity: "NPA-T ECA:4/live-proofs",
  url,
  errors,
  "1-known-information": runtime1,
  "2-comparison-missing": runtime2,
  "3-i-dont-know": runtime3,
  "4-why": runtime4,
  "5-skip-proceed": runtime5,
  "6-cap-av": runtime6,
  "7-decision-execution-boundary": runtime7,
};
const failed = ["1-known-information", "2-comparison-missing", "3-i-dont-know", "4-why", "5-skip-proceed", "6-cap-av", "7-decision-execution-boundary"].filter(
  (key) => proofs[key].pass === false,
);
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (failed.length > 0) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "7/7" }, null, 2));
