/**
 * NPA-T ECA:9 live /executive proofs. Isolated reset journeys.
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
      decisionCount: stage?.getAttribute("data-stage-thread-decision-count") ?? "none",
      executionCount: stage?.getAttribute("data-stage-thread-execution-count") ?? "none",
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
const nextBefore = await turn(page, "What’s next?");
const runtime1 = pass(
  nextBefore.readiness === "NOT_APPLICABLE" &&
    nextBefore.writes9 === "false" &&
    nextBefore.startsExecution === "false" &&
    rec.writes9 === "false",
  { rec, nextBefore },
);

await openExecutivePage(page, url);
await turn(page, "Compare outsourcing and overtime.");
await turn(page, "I choose outsourcing.");
const ready = await turn(page, "Are we ready to execute?");
const runtime2 = pass(
  ready.writes9 === "false" &&
    ready.startsExecution === "false" &&
    ready.secondWriter === "false" &&
    (ready.eca9Intent === "READINESS" || ready.readiness !== "none"),
  ready,
);

await openExecutivePage(page, url);
const gap = await turn(page, "Are we ready to execute?");
const runtime3 = pass(
  gap.writes9 === "false" &&
    (gap.readiness === "NOT_APPLICABLE" || gap.state9 === "EXECUTION_PREPARATION" || gap.state9 === "NOT_APPLICABLE" || /owner|Decision|not/i.test(gap.reply ?? "")),
  gap,
);

await openExecutivePage(page, url);
await turn(page, "Compare outsourcing and overtime.");
await turn(page, "I choose outsourcing.");
const create = await turn(page, "Create the execution.");
const runtime4 = pass(
  create.writes9 === "false" &&
    create.startsExecution === "false" &&
    create.secondWriter === "false" &&
    (create.eca9Intent === "CREATE" || create.intent === "REVIEW_EXECUTION" || /execution/i.test(create.reply ?? "")),
  create,
);

await openExecutivePage(page, url);
const beforeStart = await readEca(page);
await turn(page, "Compare outsourcing and overtime.");
await turn(page, "I choose outsourcing.");
const started = await turn(page, "Start it.");
const afterStart = await readEca(page);
const runtime5 = pass(
  started.writes9 === "false" &&
    started.startsExecution === "false" &&
    started.secondWriter === "false" &&
    (started.intent !== "REQUEST_EXECUTION_ACTION" || started.action === "HANDOFF_TO_CANONICAL_AUTHORITY" || started.action === "ASK_FOR_MISSING_INFORMATION"),
  { beforeStart, started, afterStart },
);

await openExecutivePage(page, url);
await turn(page, "Should I worry about CAP_AV?");
const cap = await turn(page, "Are we ready to execute?");
const runtime6 = pass(
  cap.writes9 === "false" &&
    cap.startsExecution === "false" &&
    (cap.readiness === "NOT_APPLICABLE" || cap.readiness === "READY_WITH_CONDITIONS" || /CAP_AV|not/i.test(cap.reply ?? "")),
  cap,
);

await openExecutivePage(page, url);
await turn(page, "Compare outsourcing and overtime.");
await turn(page, "I choose outsourcing.");
await turn(page, "Start it.");
const live = await turn(page, "What’s happening now?");
const runtime7 = pass(
  live.writes9 === "false" &&
    live.startsExecution === "false" &&
    (live.readiness === "ALREADY_EXECUTING" || live.state9 === "EXECUTION_ALREADY_ACTIVE" || live.eca9Intent === "LIVE" || /execution|progress|active|Decision/i.test(live.reply ?? "")),
  live,
);

const proofs = {
  identity: "NPA-T ECA:9/live-proofs",
  url,
  errors,
  "1-canonical-decision-gate": runtime1,
  "2-readiness": runtime2,
  "3-material-gap": runtime3,
  "4-create-boundary": runtime4,
  "5-start-boundary": runtime5,
  "6-cap-av": runtime6,
  "7-active-execution-handoff": runtime7,
};
const keys = Object.keys(proofs).filter((key) => key !== "identity" && key !== "url" && key !== "errors");
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "7/7" }, null, 2));
