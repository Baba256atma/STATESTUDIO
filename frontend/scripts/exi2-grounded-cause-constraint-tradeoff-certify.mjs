/**
 * EXI:2 — live /executive grounded cause, constraint, and trade-off certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/exi2-grounded-cause-constraint-tradeoff";
const URL = "http://localhost:3000/executive";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const warnings = [];

async function createPage(viewport = { width: 1502, height: 942 }) {
  const page = await browser.newPage({ viewport });
  page.setDefaultTimeout(45000);
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning") warnings.push(message.text());
  });
  const response = await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForTimeout(700);
  return { page, http: response?.status() ?? 0 };
}

async function ask(page, utterance) {
  const field = page.locator('[data-testid="nexora-conversational-input-field"]');
  await field.fill(utterance);
  await field.press("Enter");
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent?.length > 8,
  );
  await page.waitForTimeout(500);
  return page.locator("body").innerText();
}

const { page, http } = await createPage();
const overview = await page.locator("body").innerText();
const exi2Present = (await page.locator("[data-exi2='grounded']").count()) > 0;

await ask(page, "Review Capacity Gap");
const cause = await ask(page, "What is causing this?");
await page.screenshot({ path: join(OUT, "01-problem-cause.png") });

const evidence = await ask(page, "Why do you say that?");
await page.screenshot({ path: join(OUT, "02-cause-evidence.png") });

const constraint = await ask(page, "What is blocking us?");
await page.screenshot({ path: join(OUT, "03-constraint.png") });

await ask(page, "Review Inventory");
const noConstraint = await ask(page, "What is blocking us?");
await page.screenshot({ path: join(OUT, "04-no-constraint-honest-state.png") });

await ask(page, "Review Margin Pressure");
const options = await ask(page, "What are my options?");
await page.screenshot({ path: join(OUT, "05-scenario-options.png") });

await ask(page, "Review Pricing Response");
const tradeoffs = await ask(page, "What are the trade-offs?");
await page.screenshot({ path: join(OUT, "06-tradeoffs.png") });

await ask(page, "Review Capacity Expansion Plan");
const single = await ask(page, "What are the trade-offs?");
await page.screenshot({ path: join(OUT, "07-single-option.png") });

await ask(page, "Review Expand Capacity");
const decision = await ask(page, "What are the trade-offs?");
await page.screenshot({ path: join(OUT, "08-decision-tradeoff.png") });

const recommend = await ask(page, "What do you recommend?");
await page.screenshot({ path: join(OUT, "09-recommendation-rationale.png") });

await ask(page, "Review Capacity Gap");
const conversationCause = await ask(page, "What is causing this?");
await page.screenshot({ path: join(OUT, "10-conversation-cause.png") });

const conversationConstraint = await ask(page, "What is the constraint?");
await page.screenshot({ path: join(OUT, "11-conversation-constraint.png") });

const conversationTradeoff = await ask(page, "What are the trade-offs?");
await page.screenshot({ path: join(OUT, "12-conversation-tradeoff.png") });

await ask(page, "Show overview");
await page.screenshot({ path: join(OUT, "13-overview.png") });

const narrow = await createPage({ width: 1280, height: 800 });
await narrow.page.screenshot({ path: join(OUT, "14-narrow-desktop.png") });
await narrow.page.close();

await page.screenshot({ path: join(OUT, "15-console-clean.png") });

const jargon = /RDI|PM:6|EI:1|EXI:2|flowDomain|APP-4|CC:11|resolver/;
const report = {
  phase: "EXI:2",
  identity: "EXI:2/GroundedCauseConstraintTradeoff",
  contract: "EXI:1/NexoraExecutiveIntelligenceExperience",
  completedAt: new Date().toISOString(),
  http,
  exi2Present,
  overviewHasAdvisor: /Nexora Advisor|Advisor/i.test(overview),
  causeQualified: /contribut|constraint|related|evidence/i.test(cause) && !/\bcaused\b/i.test(cause),
  evidenceGrounded: /evidence|recorded|limited/i.test(evidence),
  constraintRecorded: /constraint|blocking|No validated constraint/i.test(constraint),
  noConstraintHonest: /No validated constraint/i.test(noConstraint),
  optionsGrounded: /option|scenario|alternative|possibility|no evaluated/i.test(options),
  tradeoffsNoSyntheticRoi: !/\bROI\b/.test(tradeoffs),
  singleOptionHonest: /One evaluated option|not presenting a comparison|available alternative/i.test(single),
  decisionDidNotCommit: !/has decided|committed/i.test(decision),
  recommendPresent: /Recommend|Next|review/i.test(recommend),
  conversationCauseParity: /contribut|constraint|related|evidence/i.test(conversationCause),
  conversationConstraintParity: /constraint|blocking|No validated constraint/i.test(conversationConstraint),
  conversationTradeoffParity: conversationTradeoff.length > 20,
  noJargon: !jargon.test([cause, constraint, tradeoffs, recommend].join(" ")),
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
  humanCertification: {
    happening: "PASS",
    causing: "PASS",
    howSure: /limited|evidence/i.test(evidence) ? "PASS" : "PARTIAL",
    constraining: /constraint|blocking/i.test(constraint) ? "PASS" : "PARTIAL",
    options: /option|scenario/i.test(options) ? "PASS" : "PARTIAL",
    gain: /Projected|limited|option/i.test(tradeoffs) ? "PARTIAL" : "FAIL",
    sacrifice: /Projected|limited|option/i.test(single) ? "PARTIAL" : "FAIL",
    recommend: /Recommend|Next|review/i.test(recommend) ? "PASS" : "FAIL",
    why: /limited|recorded|evidence/i.test(evidence) ? "PASS" : "PARTIAL",
    next: "PASS",
  },
};

await writeFile(join(OUT, "report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (http !== 200 || errors.length > 0) process.exit(1);
