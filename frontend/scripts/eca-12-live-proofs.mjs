/**
 * NPA-T ECA:12 live /executive proofs. Maximum 5 isolated reset journeys.
 * Does not start ECA:13.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-12");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const stage = document.querySelector("[data-stage-thread-decision-count]");
    return {
      state11: shell?.getAttribute("data-eca-11-state") ?? "none",
      attribution: shell?.getAttribute("data-eca-11-attribution") ?? "none",
      learning: shell?.getAttribute("data-eca-12-learning") ?? "none",
      closure: shell?.getAttribute("data-eca-12-closure") ?? "none",
      reassess: shell?.getAttribute("data-eca-12-reassess") ?? "none",
      writes12: shell?.getAttribute("data-eca-12-writes") ?? "none",
      app4: shell?.getAttribute("data-eca-12-app4") ?? "none",
      secondEngine: shell?.getAttribute("data-eca-12-second-engine") ?? "none",
      objectiveStore: shell?.getAttribute("data-eca-12-objective-store") ?? "none",
      theatreOutcome: mount?.getAttribute("data-theatre-outcome-observation-state") ?? "none",
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
  await turn(page, "Approve Demand Surge");
  return turn(page, "Start it.");
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });

// 1. Outcome → What did we learn?
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const learned = await turn(page, "What did we learn?");
const runtime1 = pass(
  learned.writes12 === "false" &&
    learned.app4 === "false" &&
    learned.secondEngine === "false" &&
    learned.attribution === "NOT_ESTABLISHED" &&
    /strengthen|bounded|does not establish|doesn[’']t establish|target|learn/i.test(learned.reply ?? "") &&
    !/capacity caused|always improves/i.test(learned.reply ?? ""),
  learned,
);

// 2. Causal challenge → no inflation
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
await turn(page, "What did we learn?");
const cause = await turn(page, "So the execution caused the improvement?");
const runtime2 = pass(
  cause.writes12 === "false" &&
    cause.app4 === "false" &&
    !/execution caused|proved the cause|definitely caused/i.test(cause.reply ?? "") &&
    (cause.attribution === "NOT_ESTABLISHED" || /does not establish|doesn[’']t establish|not establish|uncertain/i.test(cause.reply ?? "")),
  cause,
);

// 3. Mixed/unfavorable → reassessment
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const rethink = await turn(page, "Should we reconsider the approach?");
const runtime3 = pass(
  rethink.writes12 === "false" &&
    rethink.app4 === "false" &&
    (rethink.reassess === "true" || /reassess|reconsider|approach/i.test(rethink.reply ?? "")) &&
    !/new Decision has been created|Goal has been changed/i.test(rethink.reply ?? ""),
  rethink,
);

// 4. Should we do this again? → bounded future guidance
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const again = await turn(page, "Should we do this again?");
const runtime4 = pass(
  again.writes12 === "false" &&
    again.app4 === "false" &&
    again.secondEngine === "false" &&
    !/always repeat|must always/i.test(again.reply ?? ""),
  again,
);

// 5. Refresh → no invented durable Learning
await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const first = await turn(page, "What did we learn?");
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="nexora-executive-shell"]', { timeout: 45000 });
const refreshed = await turn(page, "What did we learn?");
const runtime5 = pass(
  first.writes12 === "false" &&
    first.app4 === "false" &&
    refreshed.writes12 === "false" &&
    refreshed.app4 === "false" &&
    refreshed.secondEngine === "false" &&
    refreshed.objectiveStore === "false",
  { first, refreshed },
);

const proofs = {
  identity: "NPA-T ECA:12/live-proofs",
  url,
  errors,
  pageErrors: errors.length,
  learningWrites: 0,
  "1-outcome-to-learning": runtime1,
  "2-causal-challenge-no-inflation": runtime2,
  "3-reassessment-advisory": runtime3,
  "4-future-guidance-bounded": runtime4,
  "5-refresh-no-durable-learning": runtime5,
};
const keys = [
  "1-outcome-to-learning",
  "2-causal-challenge-no-inflation",
  "3-reassessment-advisory",
  "4-future-guidance-bounded",
  "5-refresh-no-durable-learning",
];
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (errors.length > 0 || keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: 0, learningWrites: 0 }, null, 2));
