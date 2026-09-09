/**
 * NPA-T ECA:4-POST1 live /executive proofs. Isolated reset journeys.
 * Does not start ECA:13. Does not reopen ECA:4 architecture.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-4-POST1");
const IDENTITY = /Nexora is the executive decision workspace/i;
const REPRO =
  "you say: Nexora does not yet have enough evidence to determine this. what do you need for determine it ?";

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      nextAction: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      action: shell?.getAttribute("data-eca-4-action") ?? "none",
      ask: shell?.getAttribute("data-eca-4-ask") ?? "none",
      type: shell?.getAttribute("data-eca-4-type") ?? "none",
      status: shell?.getAttribute("data-eca-4-status") ?? "none",
      necessity: shell?.getAttribute("data-eca-4-necessity") ?? "none",
      source: shell?.getAttribute("data-eca-4-source") ?? "none",
      subject: shell?.getAttribute("data-eca-4-subject") ?? "none",
      consumed: shell?.getAttribute("data-eca-4-consumed") ?? "none",
      writes: shell?.getAttribute("data-eca-4-writes") ?? "none",
      eca5bound: shell?.getAttribute("data-eca-5-bound") ?? "none",
      eca5type: shell?.getAttribute("data-eca-5-type") ?? "none",
      eca6objective: shell?.getAttribute("data-eca-6-objective") ?? "none",
      eca9readiness: shell?.getAttribute("data-eca-9-readiness") ?? "none",
      eca12reassess: shell?.getAttribute("data-eca-12-reassess") ?? "none",
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      stageMode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
    };
  });
}

async function turn(page, utterance) {
  const chat = await askExecutiveChat(page, utterance);
  const eca = await readEca(page);
  return { utterance, reply: chat.last, priorAdvisor: chat.prior ?? null, ...eca };
}

function pass(condition, actual) {
  return { pass: Boolean(condition), actual };
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });

async function reportedPrefix(page) {
  await openExecutivePage(page, url);
  await turn(page, "Focus on Risk.");
  const stage = await turn(page, "what is on stage now ?");
  const explain = await turn(page, "Explain this.");
  return { stage, explain };
}

const prefix1 = await reportedPrefix(page);
const runtime1Turn = await turn(page, REPRO);
const runtime1 = pass(
  !IDENTITY.test(runtime1Turn.reply ?? "") &&
    /Risk/i.test(runtime1Turn.reply ?? "") &&
    /Margin/i.test(runtime1Turn.reply ?? "") &&
    runtime1Turn.writes === "false" &&
    !/risk_probability|causal_score/i.test(runtime1Turn.reply ?? ""),
  { prefix: prefix1, final: runtime1Turn },
);

const prefix2 = await reportedPrefix(page);
await turn(page, "What do you need to determine it?");
const runtime2Turn = await turn(page, "Margin fell in July.");
const runtime2 = pass(
  /still need|timing|appeared|intensif/i.test(runtime2Turn.reply ?? "") &&
    !/What do you mean by margin/i.test(runtime2Turn.reply ?? "") &&
    !IDENTITY.test(runtime2Turn.reply ?? ""),
  runtime2Turn,
);

const prefix3 = await reportedPrefix(page);
const runtime3Turn = await turn(page, "What evidence do you need?");
const runtime3 = pass(
  !IDENTITY.test(runtime3Turn.reply ?? "") &&
    /evidence|timing|Risk|Margin/i.test(runtime3Turn.reply ?? "") &&
    !/Give me margin history/i.test(runtime3Turn.reply ?? ""),
  runtime3Turn,
);

const prefix4 = await reportedPrefix(page);
await turn(page, "What do you need to determine it?");
const runtime4Turn = await turn(page, "I don't know.");
const runtime4 = pass(
  /unknown|unresolved|uncertain/i.test(runtime4Turn.reply ?? "") &&
    !( /\?/.test(runtime4Turn.reply ?? "") && /when this Risk changed/i.test(runtime4Turn.reply ?? "")),
  runtime4Turn,
);

await openExecutivePage(page, url);
const runtime5Turn = await turn(page, "What do you need to determine it?");
const runtime5 = pass(
  !IDENTITY.test(runtime5Turn.reply ?? "") &&
    runtime5Turn.consumed !== "true" &&
    !/I need evidence that connects this Risk with Margin Pressure/i.test(runtime5Turn.reply ?? ""),
  runtime5Turn,
);

await openExecutivePage(page, url);
const runtime6Turn = await turn(page, "We need to reduce cost.");
const runtime6 = pass(
  !/I need evidence that connects this Risk/i.test(runtime6Turn.reply ?? "") &&
    runtime6Turn.consumed !== "true",
  runtime6Turn,
);

const prefix7 = await reportedPrefix(page);
const cap = await turn(page, "What does CAP_AV mean?");
const runtime7Turn = await turn(page, "Okay. What do you still need for the Risk?");
const runtime7 = pass(
  !IDENTITY.test(runtime7Turn.reply ?? "") &&
    /Risk|evidence|timing|Margin/i.test(runtime7Turn.reply ?? "") &&
    !/confirmed available capacity evidence/i.test(runtime7Turn.reply ?? ""),
  { cap, resume: runtime7Turn },
);

const screenshot = join(out, "live-proofs.png");
await page.screenshot({ path: screenshot, fullPage: true });

const report = {
  identity: "NPA-T ECA:4-POST1/InformationNeedAdvisorIntegration",
  url,
  pageErrors: errors,
  runtimes: {
    runtime1: { name: "exact reported conversation", ...runtime1 },
    runtime2: { name: "partial manager answer", ...runtime2 },
    runtime3: { name: "existing data first / evidence need", ...runtime3 },
    runtime4: { name: "I don't know", ...runtime4 },
    runtime5: { name: "ambiguous or unfocused referent", ...runtime5 },
    runtime6: { name: "non-ECA4 need", ...runtime6 },
    runtime7: { name: "CAP_AV semantic safety then resume", ...runtime7 },
  },
  screenshot,
};

await writeFile(join(out, "live-proofs.json"), JSON.stringify(report, null, 2));
const failed = Object.values(report.runtimes).filter((item) => !item.pass);
if (failed.length) {
  console.error("ECA:4-POST1 live proofs failed", failed.map((item) => item.name));
  process.exit(1);
}
console.log("ECA:4-POST1 live proofs 7/7 PASS");
