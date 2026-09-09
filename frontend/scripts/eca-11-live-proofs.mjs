/**
 * NPA-T ECA:11 live /executive proofs. Isolated reset journeys.
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

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Mark this complete.");
const worked = await turn(page, "Did it work?");
const runtime1 = pass(
  worked.writes11 === "false" &&
    worked.learning === "false" &&
    worked.secondWriter === "false" &&
    !/\bsucceeded\b|\bDecision failed\b|\bOutcome is confirmed\b/i.test(worked.reply ?? "") &&
    (worked.state11 === "NOT_YET_OBSERVED" || /complete|not yet|don[’']t have an observed/i.test(worked.reply ?? "") || worked.live10 === "ACTIVE"),
  worked,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const happened = await turn(page, "What happened?");
const runtime2 = pass(
  happened.writes11 === "false" &&
    happened.baseline === "IMPROVED" &&
    /3 percentage points|91%|94%/i.test(happened.reply ?? ""),
  happened,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const goal = await turn(page, "Did we achieve the Goal?");
const runtime3 = pass(
  goal.writes11 === "false" &&
    goal.target === "NOT_MET" &&
    /2 points below|2 percentage points below/i.test(goal.reply ?? "") &&
    !/Decision success score|couldn[’']t complete that request/i.test(goal.reply ?? ""),
  goal,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const cause = await turn(page, "Did this Decision cause the improvement?");
const runtime4 = pass(
  cause.attribution === "NOT_ESTABLISHED" &&
    cause.writes11 === "false" &&
    /doesn[’']t establish|not establish|alone doesn/i.test(cause.reply ?? ""),
  cause,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
await turn(page, "Delivery is 96%.");
const conflict = await turn(page, "What’s the result?");
const runtime5 = pass(
  conflict.writes11 === "false" &&
    (conflict.state11 === "CONFLICTED" || /disagree|reported|94%|96%/i.test(conflict.reply ?? "")),
  conflict,
);

await openExecutivePage(page, url);
await turn(page, "Should I worry about CAP_AV?");
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const cap = await turn(page, "Did capacity cause the improvement?");
const runtime6 = pass(
  cap.writes11 === "false" &&
    cap.attribution === "NOT_ESTABLISHED" &&
    !/capacity caused/i.test(cap.reply ?? ""),
  cap,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const next = await turn(page, "What should we do now?");
const runtime7 = pass(
  next.writes11 === "false" &&
    next.learning === "false" &&
    next.secondWriter === "false" &&
    /reassess|review/i.test(next.reply ?? ""),
  next,
);

const proofs = {
  identity: "NPA-T ECA:11/live-proofs",
  url,
  errors,
  "1-completion-without-outcome": runtime1,
  "2-baseline-comparison": runtime2,
  "3-goal-comparison": runtime3,
  "4-causality": runtime4,
  "5-conflict": runtime5,
  "6-cap-av": runtime6,
  "7-reassessment-boundary": runtime7,
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
