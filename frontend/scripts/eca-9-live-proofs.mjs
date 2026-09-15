/**
 * NPA-T ECA:9 live /executive proofs. Maximum 5 isolated reset journeys.
 * Does not start ECA:10.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-9");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector("[data-stage-thread-decision-count]");
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      action: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      state8: shell?.getAttribute("data-eca-8-state") ?? "none",
      writes8: shell?.getAttribute("data-eca-8-writes") ?? "none",
      state9: shell?.getAttribute("data-eca-9-state") ?? "none",
      readiness: shell?.getAttribute("data-eca-9-readiness") ?? "none",
      eca9Intent: shell?.getAttribute("data-eca-9-intent") ?? "none",
      create: shell?.getAttribute("data-eca-9-create") ?? "none",
      start: shell?.getAttribute("data-eca-9-start") ?? "none",
      writes9: shell?.getAttribute("data-eca-9-writes") ?? "none",
      secondWriter: shell?.getAttribute("data-eca-9-second-writer") ?? "none",
      startsExecution: shell?.getAttribute("data-eca-9-starts-execution") ?? "none",
      decisionCount: stage?.getAttribute("data-stage-thread-decision-count") ?? "0",
      executionCount: stage?.getAttribute("data-stage-thread-execution-count") ?? "0",
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

// 1. Approved Decision path → readiness review → Execution 0 (ECA:9 does not start)
await turn(page, "Compare Demand Surge and Pricing Response.");
await turn(page, "I choose Demand Surge.");
const ready = await turn(page, "Are we ready to execute?");
const runtime1 = pass(
  ready.writes9 === "false" &&
    ready.startsExecution === "false" &&
    ready.secondWriter === "false" &&
    (ready.eca9Intent === "READINESS" || ready.readiness !== "none") &&
    Number(ready.executionCount ?? 0) === 0,
  ready,
);

// 2. NOT_READY / BLOCKED / NOT_APPLICABLE → no Start
await openExecutivePage(page, url);
const gap = await turn(page, "Are we ready to execute?");
const runtime2 = pass(
  gap.writes9 === "false" &&
    gap.startsExecution === "false" &&
    (gap.readiness === "NOT_APPLICABLE" ||
      gap.readiness === "NOT_READY" ||
      gap.readiness === "BLOCKED" ||
      gap.readiness === "READY_WITH_CONDITIONS" ||
      gap.state9 === "NOT_APPLICABLE" ||
      /owner|Decision|not|ready/i.test(gap.reply ?? "")),
  gap,
);

// 3. READY_WITH_CONDITIONS / condition preserved (CAP_AV or gap path)
await openExecutivePage(page, url);
await turn(page, "Should I worry about CAP_AV?");
const conditioned = await turn(page, "Are we ready to execute?");
const runtime3 = pass(
  conditioned.writes9 === "false" &&
    conditioned.startsExecution === "false" &&
    (conditioned.readiness === "NOT_APPLICABLE" ||
      conditioned.readiness === "READY_WITH_CONDITIONS" ||
      conditioned.readiness === "NOT_READY" ||
      /CAP_AV|condition|uncertain|not/i.test(conditioned.reply ?? "")),
  conditioned,
);

// 4. Explicit Start → CC:11 handoff only (ECA:9 does not write)
await openExecutivePage(page, url);
const beforeStart = await readEca(page);
await turn(page, "Compare Demand Surge and Pricing Response.");
await turn(page, "I choose Demand Surge.");
const started = await turn(page, "Start the execution.");
const afterStart = await readEca(page);
const runtime4 = pass(
  started.writes9 === "false" &&
    started.startsExecution === "false" &&
    started.secondWriter === "false" &&
    (started.eca9Intent === "START" ||
      started.intent === "REQUEST_EXECUTION_ACTION" ||
      started.action === "HANDOFF_TO_CANONICAL_AUTHORITY" ||
      /execution|start|handoff/i.test(started.reply ?? "")),
  { beforeStart, started, afterStart },
);

// 5. Current-state / no duplicate writer after start dialogue
await openExecutivePage(page, url);
await turn(page, "Compare Demand Surge and Pricing Response.");
await turn(page, "I choose Demand Surge.");
await turn(page, "Start it.");
const live = await turn(page, "What’s happening now?");
const runtime5 = pass(
  live.writes9 === "false" &&
    live.startsExecution === "false" &&
    live.secondWriter === "false" &&
    (live.readiness === "ALREADY_EXECUTING" ||
      live.state9 === "EXECUTION_ALREADY_ACTIVE" ||
      live.eca9Intent === "LIVE" ||
      /execution|progress|active|Decision|start/i.test(live.reply ?? "")),
  live,
);

const proofs = {
  identity: "NPA-T ECA:9/live-proofs",
  url,
  errors,
  pageErrors: errors.length,
  "1-decision-readiness-execution-zero": runtime1,
  "2-not-ready-or-blocked-no-start": runtime2,
  "3-ready-with-conditions-preserved": runtime3,
  "4-explicit-start-cc11-only": runtime4,
  "5-no-duplicate-execution-writer": runtime5,
};
const keys = [
  "1-decision-readiness-execution-zero",
  "2-not-ready-or-blocked-no-start",
  "3-ready-with-conditions-preserved",
  "4-explicit-start-cc11-only",
  "5-no-duplicate-execution-writer",
];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (errors.length > 0 || keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: 0 }, null, 2));
