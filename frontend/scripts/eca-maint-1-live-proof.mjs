/**
 * ECA:MAINT-1 — short live proof for commitment-review fidelity.
 * Max ~8 turns. Does not rerun ECA:FINAL.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-MAINT");
const OUTCOME_LEAK = /which business outcome|help investigate that/i;
const ARCH_LEAK = /\b(?:ECA(?::|-)|CC:\d|DTH|UNSPECIFIED)\b/i;

async function readShell(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector("[data-stage-thread-decision-count]");
    return {
      state8: shell?.getAttribute("data-eca-8-state") ?? "none",
      resolution: shell?.getAttribute("data-eca-8-target-resolution") ?? "none",
      writes8: shell?.getAttribute("data-eca-8-writes") ?? "none",
      handoff: shell?.getAttribute("data-eca-8-handoff") ?? "none",
      canonicalApproved:
        shell?.getAttribute("data-canonical-approved-decision-count") ?? "0",
      canonicalExecutions:
        shell?.getAttribute("data-canonical-execution-count") ?? "0",
      decisionCount: stage?.getAttribute("data-stage-thread-decision-count") ?? "0",
      executionCount: stage?.getAttribute("data-stage-thread-execution-count") ?? "0",
    };
  });
}

async function turn(page, utterance) {
  const chat = await askExecutiveChat(page, utterance);
  return { utterance, reply: chat.last ?? "", ...(await readShell(page)) };
}

async function prepareCandidate(page) {
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
  await turn(page, "show scenarios");
  await turn(page, "Compare them.");
  const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
  if ((await reviewBtn.count()) > 0) await reviewBtn.click({ force: true });
  await page.waitForTimeout(300);
  const changeB = page.locator('[data-testid="nexora-theatre-decision-candidate-ctx-scenario-demand"]');
  if ((await changeB.count()) > 0) await changeB.click({ force: true });
  await page.waitForTimeout(300);
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });
await page.goto("about:blank");
await openExecutivePage(page, url);
await prepareCandidate(page);
const before = await readShell(page);
const review = await turn(page, "What would we be committing to?");
const reviewPass =
  errors.length === 0 &&
  !OUTCOME_LEAK.test(review.reply) &&
  !ARCH_LEAK.test(review.reply) &&
  /commit|approv|Decision|selected course|execution/i.test(review.reply) &&
  Number(review.canonicalApproved) === Number(before.canonicalApproved) &&
  Number(review.canonicalExecutions) === Number(before.canonicalExecutions) &&
  review.writes8 !== "true";

const approved = await turn(page, "Approve Demand Surge");
const commitPass =
  Number(approved.canonicalApproved) >= 1 ||
  /Approved|committed Decision|Decision/i.test(approved.reply);

const evidence = {
  identity: "NPA-T ECA:MAINT-1/live-commitment-review",
  url,
  pageErrors: errors.length,
  before,
  review,
  approved,
  reviewPass,
  commitPass,
  passed: reviewPass && commitPass && errors.length === 0,
};

await writeFile(join(out, "maint-1-live-proof.json"), `${JSON.stringify(evidence, null, 2)}\n`);
await page.screenshot({ path: join(out, "maint-1-live-proof.png"), fullPage: true });
await browser.close();
console.log(
  JSON.stringify(
    {
      passed: evidence.passed,
      reviewPass,
      commitPass,
      pageErrors: errors.length,
      decisions: approved.canonicalApproved,
    },
    null,
    2,
  ),
);
if (!evidence.passed) process.exit(1);
