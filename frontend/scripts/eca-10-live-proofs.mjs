/**
 * NPA-T ECA:10 live /executive proofs. Isolated reset journeys.
 * Does not start ECA:11.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-10");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector("[data-stage-thread-decision-count]");
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      action: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      state9: shell?.getAttribute("data-eca-9-state") ?? "none",
      readiness: shell?.getAttribute("data-eca-9-readiness") ?? "none",
      writes9: shell?.getAttribute("data-eca-9-writes") ?? "none",
      live: shell?.getAttribute("data-eca-10-live") ?? "none",
      track: shell?.getAttribute("data-eca-10-track") ?? "none",
      deviation: shell?.getAttribute("data-eca-10-deviation") ?? "none",
      eca10Intent: shell?.getAttribute("data-eca-10-intent") ?? "none",
      writes10: shell?.getAttribute("data-eca-10-writes") ?? "none",
      secondWriter: shell?.getAttribute("data-eca-10-second-writer") ?? "none",
      monitor: shell?.getAttribute("data-eca-10-monitor") ?? "none",
      initiative: shell?.getAttribute("data-eca-10-initiative") ?? "none",
      state8: shell?.getAttribute("data-eca-8-state") ?? "none",
      confirm8: shell?.getAttribute("data-eca-8-confirmation") ?? "none",
      decisionCount: stage?.getAttribute("data-stage-thread-decision-count") ?? "none",
      executionCount: stage?.getAttribute("data-stage-thread-execution-count") ?? "none",
      theatreLive: document.querySelector('[data-testid="nexora-stage-mount"]')?.getAttribute("data-theatre-live-execution-state") ?? "none",
      executionStarted: shell?.getAttribute("data-nex-exp8-started") ?? "none",
      decisionCommitted: shell?.getAttribute("data-nex-exp7-committed") ?? "none",
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

async function prepareDecision(page) {
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
  await turn(page, "show scenarios");
  await turn(page, "Compare them.");
  const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
  if ((await reviewBtn.count()) > 0) await reviewBtn.click({ force: true });
  await page.waitForTimeout(300);
  const changeB = page.locator('[data-testid="nexora-theatre-decision-candidate-ctx-scenario-demand"]');
  if ((await changeB.count()) > 0) await changeB.click({ force: true });
  await page.waitForTimeout(300);
  await page.locator('[data-testid="nexora-theatre-decision-commit"]').click({ force: true, timeout: 4000 }).catch(() => null);
  return turn(page, "Approve Demand Surge");
}

async function commitAndStart(page) {
  await prepareDecision(page);
  return turn(page, "Start it.");
}

await openExecutivePage(page, url);
await prepareDecision(page);
const beforeStart = await turn(page, "How is execution going?");
await turn(page, "Start it.");
const afterStart = await turn(page, "How is execution going?");
const runtime1 = pass(
  beforeStart.live === "NOT_LIVE" &&
    beforeStart.writes10 === "false" &&
    afterStart.writes10 === "false" &&
    afterStart.secondWriter === "false" &&
    afterStart.monitor === "false" &&
    (afterStart.live === "ACTIVE" || afterStart.live === "BLOCKED" || afterStart.live === "COMPLETED"),
  { beforeStart, afterStart },
);

await openExecutivePage(page, url);
await commitAndStart(page);
const summary = await turn(page, "Update me.");
const runtime2 = pass(
  summary.writes10 === "false" &&
    (summary.live === "ACTIVE" || summary.live === "BLOCKED" || /active|execution|progress/i.test(summary.reply ?? "")),
  summary,
);

await openExecutivePage(page, url);
await commitAndStart(page);
const track = await turn(page, "Are we on track?");
const runtime3 = pass(
  track.track === "UNKNOWN" &&
    track.writes10 === "false" &&
    !/off-track because/i.test(track.reply ?? "") &&
    /baseline|uncertain|on-track or off-track|can't reliably|cannot|don't have/i.test(track.reply ?? ""),
  track,
);

await openExecutivePage(page, url);
await commitAndStart(page);
const changed = await turn(page, "What changed?");
const runtime4 = pass(
  changed.writes10 === "false" &&
    changed.track !== "OFF_TRACK" &&
    changed.track !== "ON_TRACK" &&
    changed.track !== "AHEAD" &&
    (changed.deviation === "UNKNOWN" || changed.deviation === "NO_MATERIAL_DEVIATION" || /prior|current state/i.test(changed.reply ?? "")),
  changed,
);

await openExecutivePage(page, url);
await commitAndStart(page);
const attention = await turn(page, "What needs my attention?");
const runtime5 = pass(
  attention.writes10 === "false" &&
    attention.initiative === "false" &&
    !/risk is a blocker/i.test(attention.reply ?? ""),
  attention,
);

await openExecutivePage(page, url);
await turn(page, "Should I worry about CAP_AV?");
await commitAndStart(page);
const cap = await turn(page, "Are we on track?");
const runtime6 = pass(
  cap.writes10 === "false" &&
    cap.track === "UNKNOWN" &&
    !/capacity dropped/i.test(cap.reply ?? ""),
  cap,
);

await openExecutivePage(page, url);
await commitAndStart(page);
await turn(page, "Mark this complete.");
await turn(page, "Yes.");
const worked = await turn(page, "Did it work?");
const runtime7 = pass(
  worked.writes10 === "false" &&
    worked.secondWriter === "false" &&
    !/Decision failed|successful Outcome|Outcome is confirmed/i.test(worked.reply ?? "") &&
    (worked.live === "COMPLETED" || /complete|Outcome|work finished/i.test(worked.reply ?? "")),
  worked,
);

const proofs = {
  identity: "NPA-T ECA:10/live-proofs",
  url,
  errors,
  "1-live-gate": runtime1,
  "2-live-summary": runtime2,
  "3-baseline-safety": runtime3,
  "4-what-changed": runtime4,
  "5-attention": runtime5,
  "6-cap-av": runtime6,
  "7-completion-boundary": runtime7,
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
