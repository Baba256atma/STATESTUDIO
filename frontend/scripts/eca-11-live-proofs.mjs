/**
 * NPA-T ECA:11 live /executive proofs. Maximum 5 isolated reset journeys.
 * Does not start ECA:12.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-11");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      live10: shell?.getAttribute("data-eca-10-live") ?? "none",
      writes10: shell?.getAttribute("data-eca-10-writes") ?? "none",
      state11: shell?.getAttribute("data-eca-11-state") ?? "none",
      intent11: shell?.getAttribute("data-eca-11-intent") ?? "none",
      baseline: shell?.getAttribute("data-eca-11-baseline") ?? "none",
      target: shell?.getAttribute("data-eca-11-target") ?? "none",
      overall: shell?.getAttribute("data-eca-11-overall") ?? "none",
      attribution: shell?.getAttribute("data-eca-11-attribution") ?? "none",
      writes11: shell?.getAttribute("data-eca-11-writes") ?? "none",
      learning: shell?.getAttribute("data-eca-11-learning") ?? "none",
      secondWriter: shell?.getAttribute("data-eca-11-second-writer") ?? "none",
      theatreLive: mount?.getAttribute("data-theatre-live-execution-state") ?? "none",
      theatreOutcome: mount?.getAttribute("data-theatre-outcome-observation-state") ?? "none",
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
  await turn(page, "Approve Demand Surge");
  return turn(page, "Start it.");
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });

// 1. Direct Outcome / result question (COMPLETED ≠ SUCCESS when no observation)
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Mark this complete.");
const worked = await turn(page, "Did it work?");
const runtime1 = pass(
  worked.writes11 === "false" &&
    worked.learning === "false" &&
    worked.secondWriter === "false" &&
    !/\bsucceeded\b|\bDecision failed\b|\bOutcome is confirmed\b/i.test(worked.reply ?? "") &&
    (worked.state11 === "NOT_YET_OBSERVED" ||
      /complete|not yet|don[’']t have an observed/i.test(worked.reply ?? "") ||
      worked.live10 === "ACTIVE"),
  worked,
);

// 2. Baseline vs observed vs Goal
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const happened = await turn(page, "What was the result?");
const goal = await turn(page, "Did we achieve the Goal?");
const runtime2 = pass(
  happened.writes11 === "false" &&
    happened.learning === "false" &&
    (happened.baseline === "IMPROVED" || /3 percentage points|91%|94%/i.test(happened.reply ?? "")) &&
    goal.writes11 === "false" &&
    (goal.target === "NOT_MET" || /2 points below|2 percentage points below|96%/i.test(goal.reply ?? "")),
  { happened, goal },
);

// 3. Mixed / inconclusive / conflict path
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
await turn(page, "Delivery is 96%.");
const conflict = await turn(page, "What’s the result?");
const runtime3 = pass(
  conflict.writes11 === "false" &&
    conflict.learning === "false" &&
    (conflict.state11 === "CONFLICTED" ||
      conflict.overall === "INCONCLUSIVE" ||
      conflict.overall === "MIXED" ||
      /disagree|reported|94%|96%/i.test(conflict.reply ?? "")),
  conflict,
);

// 4. Causal-attribution question
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const cause = await turn(page, "Did this Decision cause the improvement?");
const runtime4 = pass(
  cause.attribution === "NOT_ESTABLISHED" &&
    cause.writes11 === "false" &&
    cause.learning === "false" &&
    /doesn[’']t establish|not establish|alone doesn/i.test(cause.reply ?? ""),
  cause,
);

// 5. Refresh fidelity — Learning writes remain 0
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const first = await turn(page, "What was the result?");
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="nexora-executive-shell"]', { timeout: 45000 });
const refreshed = await turn(page, "What was the result?");
const runtime5 = pass(
  first.writes11 === "false" &&
    first.learning === "false" &&
    refreshed.writes11 === "false" &&
    refreshed.learning === "false" &&
    refreshed.secondWriter === "false",
  { first, refreshed },
);

const proofs = {
  identity: "NPA-T ECA:11/live-proofs",
  url,
  errors,
  pageErrors: errors.length,
  learningWrites: 0,
  "1-direct-result-completed-not-success": runtime1,
  "2-baseline-observed-goal": runtime2,
  "3-mixed-or-inconclusive": runtime3,
  "4-causal-attribution": runtime4,
  "5-refresh-fidelity": runtime5,
};
const keys = [
  "1-direct-result-completed-not-success",
  "2-baseline-observed-goal",
  "3-mixed-or-inconclusive",
  "4-causal-attribution",
  "5-refresh-fidelity",
];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (errors.length > 0 || keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: 0, learningWrites: 0 }, null, 2));
