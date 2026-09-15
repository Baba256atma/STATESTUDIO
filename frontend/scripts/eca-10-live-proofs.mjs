/**
 * NPA-T ECA:10 live /executive proofs. Maximum 5 isolated reset journeys.
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

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });

// 1. Active Execution → direct status
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
    (afterStart.live === "ACTIVE" ||
      afterStart.live === "BLOCKED" ||
      afterStart.live === "COMPLETED" ||
      /active|execution|progress/i.test(afterStart.reply ?? "")),
  { beforeStart, afterStart },
);

// 2. Progress / observed vs expected (UNKNOWN without baseline is valid)
await openExecutivePage(page, url);
await commitAndStart(page);
const track = await turn(page, "Are we on track?");
const runtime2 = pass(
  track.writes10 === "false" &&
    (track.track === "UNKNOWN" || track.track === "ON_TRACK" || track.track === "OFF_TRACK" || track.track === "AHEAD") &&
    !/off-track because/i.test(track.reply ?? "") &&
    (track.track !== "UNKNOWN" ||
      /baseline|uncertain|on-track or off-track|can't reliably|cannot|don't have|progress/i.test(track.reply ?? "")),
  track,
);

// 3. Deviation path remains causal-safe
await openExecutivePage(page, url);
await commitAndStart(page);
const summary = await turn(page, "Update me.");
const runtime3 = pass(
  summary.writes10 === "false" &&
    summary.secondWriter === "false" &&
    !/caused by|confirmed cause of delay/i.test(summary.reply ?? "") &&
    (summary.live === "ACTIVE" ||
      summary.live === "BLOCKED" ||
      /active|execution|progress/i.test(summary.reply ?? "")),
  summary,
);

// 4. Risk / attention without false blocker claim
await openExecutivePage(page, url);
await commitAndStart(page);
const attention = await turn(page, "What needs my attention?");
const runtime4 = pass(
  attention.writes10 === "false" &&
    attention.initiative === "false" &&
    !/risk is a blocker/i.test(attention.reply ?? ""),
  attention,
);

// 5. Refresh → no duplicate writer / monitor
await openExecutivePage(page, url);
await commitAndStart(page);
const first = await turn(page, "How is execution going?");
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="nexora-executive-shell"]', { timeout: 45000 });
const refreshed = await turn(page, "How is execution going?");
const runtime5 = pass(
  first.writes10 === "false" &&
    refreshed.writes10 === "false" &&
    refreshed.secondWriter === "false" &&
    refreshed.monitor === "false",
  { first, refreshed },
);

const proofs = {
  identity: "NPA-T ECA:10/live-proofs",
  url,
  errors,
  pageErrors: errors.length,
  "1-active-execution-direct-status": runtime1,
  "2-progress-observed-expected": runtime2,
  "3-deviation-causal-safe": runtime3,
  "4-risk-without-false-blocked": runtime4,
  "5-refresh-no-duplicate": runtime5,
};
const keys = [
  "1-active-execution-direct-status",
  "2-progress-observed-expected",
  "3-deviation-causal-safe",
  "4-risk-without-false-blocked",
  "5-refresh-no-duplicate",
];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (errors.length > 0 || keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: 0 }, null, 2));
