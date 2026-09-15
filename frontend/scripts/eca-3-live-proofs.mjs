/**
 * NPA-T ECA:3 live /executive proofs (short set, max 5).
 * Uses canonical catalog names only. Does not start ECA:4.
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
    initiative: eca.intervene === "true" ? "SPEAK" : "SILENT",
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
const important = await turn(
  page,
  "On-time delivery is at 91% against the 96% goal and getting worse. How are we doing?",
);
const runtime1 = pass(
  important.initiative === "SPEAK" &&
    important.writes === "false" &&
    important.authority !== "CC:10 Decision Commitment" &&
    important.authority !== "CC:11 Execution Follow-up",
  important,
);

await openExecutivePage(page, url);
const silence = await turn(page, "Explain Demand Surge.");
const runtime2 = pass(
  silence.intent === "EXPLAIN" &&
    silence.initiative === "SILENT" &&
    silence.writes === "false",
  silence,
);

await openExecutivePage(page, url);
const capAvMeaning = await turn(page, "What does CAP_AV mean?");
const capAvWorry = await turn(page, "Should I worry about it?");
const runtime3 = pass(
  capAvWorry.strength !== "WARN" &&
    !/available capacity has fallen dangerously/i.test(`${capAvMeaning.reply ?? ""} ${capAvWorry.reply ?? ""}`) &&
    capAvWorry.writes === "false" &&
    capAvWorry.authority !== "CC:10 Decision Commitment",
  { capAvMeaning, capAvWorry },
);

await openExecutivePage(page, url);
const seek = await turn(page, "What should I do about Capacity Gap?");
const prefer = await turn(page, "I prefer Demand Surge.");
const runtime4 = pass(
  seek.writes === "false" &&
    prefer.writes === "false" &&
    prefer.authority !== "CC:10 Decision Commitment" &&
    prefer.nextAction !== "HANDOFF_TO_CANONICAL_AUTHORITY" &&
    Number(prefer.decisions ?? "0") === 0,
  { seek, prefer },
);

await openExecutivePage(page, url);
const ready = await turn(page, "Are we ready to start?");
const runtime5 = pass(
  ready.writes === "false" &&
    ready.authority !== "CC:11 Execution Follow-up" &&
    !/\bis running\b/i.test(ready.reply ?? "") &&
    Number(ready.executions ?? "0") === 0,
  ready,
);

const proofs = {
  identity: "NPA-T ECA:3/live-proofs",
  resume: "ECA:3-2026-09-14",
  url,
  comparisonSubjects: [
    { id: "ctx-scenario-demand", name: "Demand Surge" },
    { id: "ctx-scenario-pricing", name: "Pricing Response" },
  ],
  errors,
  "1-important-issue-speak": runtime1,
  "2-stable-silence": runtime2,
  "3-data-uncertainty": runtime3,
  "4-decision-readiness-no-commit": runtime4,
  "5-execution-readiness-no-start": runtime5,
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
