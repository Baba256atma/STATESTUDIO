/**
 * ECA:MAINT-2 — short live proof: Decision-needed vs candidate-under-review parity.
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
const MISLEADING = /\bAwaiting decision\b/;

async function readShell(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const compact =
      document.querySelector("[data-compact-context]")?.getAttribute("data-compact-context") ??
      document.querySelector('[data-testid="nexora-compact-context"]')?.textContent ??
      shell?.getAttribute("data-compact-context") ??
      "";
    const bodyText = document.body?.innerText ?? "";
    return {
      compact,
      hasMisleadingAwaitingDecision: /\bAwaiting decision\b/.test(bodyText),
      hasDecisionNeeded: /\bDecision needed\b/.test(bodyText),
      state8: shell?.getAttribute("data-eca-8-state") ?? "none",
      writes8: shell?.getAttribute("data-eca-8-writes") ?? "none",
      canonicalApproved:
        shell?.getAttribute("data-canonical-approved-decision-count") ?? "0",
      canonicalExecutions:
        shell?.getAttribute("data-canonical-execution-count") ?? "0",
    };
  });
}

async function turn(page, utterance) {
  const chat = await askExecutiveChat(page, utterance);
  return { utterance, reply: chat.last ?? "", ...(await readShell(page)) };
}

async function openReviewCandidate(page) {
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

// State 1 — Decision needed, no theatre candidate
await turn(page, "My goal is to improve delivery reliability.");
await turn(page, "Explain Capacity Gap.");
const state1 = await turn(page, "What would we be committing to?");
const state1Pass =
  !OUTCOME_LEAK.test(state1.reply) &&
  /decision is needed|no specific option|no current Decision candidate/i.test(state1.reply) &&
  !/You would be committing to/i.test(state1.reply) &&
  Number(state1.canonicalApproved) === 0 &&
  state1.writes8 !== "true";

// State 2 — Valid candidate under review
await openReviewCandidate(page);
const state2 = await turn(page, "What would we be committing to?");
const state2Pass =
  !OUTCOME_LEAK.test(state2.reply) &&
  /You would be committing to|selected course of action/i.test(state2.reply) &&
  Number(state2.canonicalApproved) === 0 &&
  state2.writes8 !== "true";

const approved = await turn(page, "Approve Demand Surge");
const approvePass = Number(approved.canonicalApproved) >= 1;

const evidence = {
  identity: "NPA-T ECA:MAINT-2/live-awaiting-decision-parity",
  url,
  pageErrors: errors.length,
  misleadingLabelObserved: MISLEADING.test(state1.reply) || state1.hasMisleadingAwaitingDecision,
  state1,
  state2,
  approved,
  state1Pass,
  state2Pass,
  approvePass,
  passed: state1Pass && state2Pass && approvePass && errors.length === 0,
};

await writeFile(join(out, "maint-2-live-proof.json"), `${JSON.stringify(evidence, null, 2)}\n`);
await page.screenshot({ path: join(out, "maint-2-live-proof.png"), fullPage: true });
await browser.close();
console.log(
  JSON.stringify(
    {
      passed: evidence.passed,
      state1Pass,
      state2Pass,
      approvePass,
      pageErrors: errors.length,
      decisions: approved.canonicalApproved,
    },
    null,
    2,
  ),
);
if (!evidence.passed) process.exit(1);
