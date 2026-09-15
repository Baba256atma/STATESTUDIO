/**
 * NPA-T ECA:4 live /executive proofs (short set, max 5).
 * Uses canonical catalog names. Does not start ECA:5.
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
      decisions: shell?.getAttribute("data-canonical-decision-count") ?? "0",
      executions: shell?.getAttribute("data-canonical-execution-count") ?? "0",
    };
  });
}

async function turn(page, utterance) {
  const chat = await askExecutiveChat(page, utterance);
  const eca = await readEca(page);
  return {
    utterance,
    reply: chat.last,
    shouldAsk: eca.ask === "true",
    ...eca,
  };
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
const known = await turn(page, "What is my current goal?");
const runtime1Strict = pass(
  known.writes === "false" &&
    known.secondClarify === "false" &&
    (known.ask === "false" || known.action === "NO_ACQUISITION_NEEDED") &&
    !/what is your goal\?/i.test(known.reply ?? ""),
  known,
);

await openExecutivePage(page, url);
const prefer = await turn(page, "Compare Demand Surge and Pricing Response.");
const choose = await turn(page, "Which should I choose?");
const runtime2 = pass(
  choose.writes === "false" &&
    choose.secondClarify === "false" &&
    Number(choose.decisions ?? "0") === 0 &&
    (choose.ask === "true" ||
      choose.action === "ASK_MANAGER" ||
      choose.action === "PROCEED_WITH_UNCERTAINTY" ||
      /delivery|cost|risk|prefer|matter/i.test(choose.reply ?? "")),
  { prefer, choose },
);

await openExecutivePage(page, url);
const capAv = await turn(page, "Should I worry about CAP_AV?");
const runtime3 = pass(
  capAv.writes === "false" &&
    capAv.authority !== "CC:10 Decision Commitment" &&
    Number(capAv.decisions ?? "0") === 0 &&
    (capAv.status === "KNOWN_UNCONFIRMED" ||
      capAv.action === "REQUEST_SEMANTIC_CONFIRMATION" ||
      capAv.status === "AMBIGUOUS" ||
      /not confirmed|unclear|mean|represent|cap_av|capacity/i.test(capAv.reply ?? "")) &&
    !/available capacity is confirmed|available capacity has fallen dangerously/i.test(capAv.reply ?? ""),
  capAv,
);

await openExecutivePage(page, url);
const seek = await turn(page, "What should I do about Capacity Gap?");
const preference = await turn(page, "I prefer Demand Surge.");
const runtime4 = pass(
  seek.writes === "false" &&
    preference.writes === "false" &&
    preference.authority !== "CC:10 Decision Commitment" &&
    Number(preference.decisions ?? "0") === 0,
  { seek, preference },
);

await openExecutivePage(page, url);
const ready = await turn(page, "Are we ready to execute?");
const runtime5 = pass(
  ready.writes === "false" &&
    ready.authority !== "CC:11 Execution Follow-up" &&
    Number(ready.executions ?? "0") === 0 &&
    !/\bis running\b/i.test(ready.reply ?? ""),
  ready,
);

const proofs = {
  identity: "NPA-T ECA:4/live-proofs",
  resume: "ECA:4-2026-09-14",
  url,
  comparisonSubjects: [
    { id: "ctx-scenario-demand", name: "Demand Surge" },
    { id: "ctx-scenario-pricing", name: "Pricing Response" },
  ],
  errors,
  "1-known-information-no-unnecessary-question": runtime1Strict,
  "2-missing-material-preference": runtime2,
  "3-cap-av-uncertainty": runtime3,
  "4-decision-related-no-mutation": runtime4,
  "5-execution-readiness-no-start": runtime5,
};

const allPass = [runtime1Strict, runtime2, runtime3, runtime4, runtime5].every((item) => item.pass);
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (!allPass || errors.length > 0) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: errors.length }, null, 2));
