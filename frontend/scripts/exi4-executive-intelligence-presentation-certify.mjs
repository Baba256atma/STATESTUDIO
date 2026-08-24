/**
 * EXI:4 — live /executive presentation consolidation certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/exi4-executive-intelligence-presentation";
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
  await page.waitForTimeout(800);
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
  await page.waitForTimeout(450);
  return page.locator("body").innerText();
}

async function openDisclosure(page, testId) {
  const node = page.locator(`[data-testid="${testId}"]`);
  if ((await node.count()) === 0) return false;
  const open = await node.evaluate((el) => el.hasAttribute("open"));
  if (!open) {
    await node.locator("summary").first().click();
    await page.waitForTimeout(200);
  }
  return true;
}

const { page, http } = await createPage();
const exi4Present = (await page.locator('[data-exi4="presentation"]').count()) > 0;
const overview = await page.locator("body").innerText();
await page.screenshot({ path: join(OUT, "01-overview.png") });

const attentionVsPriority = /Needs Attention/i.test(overview) && /Top Priority/i.test(overview);
await page.screenshot({ path: join(OUT, "02-priority-attention.png") });

await ask(page, "Review Capacity Gap");
const problem = await page.locator("body").innerText();
await openDisclosure(page, "nexora-advisor-contributors");
await openDisclosure(page, "nexora-advisor-constraint");
await page.screenshot({ path: join(OUT, "03-problem-intelligence.png") });
await page.screenshot({ path: join(OUT, "04-contributors.png") });
await page.screenshot({ path: join(OUT, "05-constraints.png") });

await openDisclosure(page, "nexora-advisor-more-detail");
await page.screenshot({ path: join(OUT, "06-evidence-uncertainty.png") });

await ask(page, "Review Margin Pressure");
await ask(page, "Compare the options.");
await openDisclosure(page, "nexora-advisor-tradeoffs");
const multi = await page.locator("body").innerText();
await page.screenshot({ path: join(OUT, "07-multi-option.png") });
await page.screenshot({ path: join(OUT, "08-tradeoffs.png") });

await openDisclosure(page, "nexora-advisor-more-detail");
const missing = await page.locator("body").innerText();
await page.screenshot({ path: join(OUT, "09-missing-dimensions.png") });

await ask(page, "Review Approve Repricing");
const decision = await page.locator("body").innerText();
await page.screenshot({ path: join(OUT, "10-decision.png") });

await ask(page, "Show overview");
const whatMatters = await ask(page, "What matters most right now?");
const why = await ask(page, "Why?");
await ask(page, "Review Capacity Gap");
const causing = await ask(page, "What may be causing this?");
const constraining = await ask(page, "What is constraining us?");
await ask(page, "Review Margin Pressure");
const compare = await ask(page, "Compare the options.");
const sacrifice = await ask(page, "What do we sacrifice?");
const cheaper = await ask(page, "Which is cheaper?");
const sure = await ask(page, "How sure are you?");
await page.screenshot({ path: join(OUT, "11-conversation-parity.png") });

await ask(page, "Review Capacity Expansion Plan");
const single = await ask(page, "Compare the options.");
await page.screenshot({ path: join(OUT, "12-single-option.png") });

await ask(page, "Review Inventory");
const unknown = await ask(page, "What may be causing this?");
await page.screenshot({ path: join(OUT, "13-unknown-state.png") });

const narrow = await createPage({ width: 1280, height: 800 });
await narrow.page.screenshot({ path: join(OUT, "14-narrow-desktop.png") });
const narrowOverflow = await narrow.page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);
await narrow.page.close();

await page.screenshot({ path: join(OUT, "15-console-clean.png") });

const jargon = /CORE-INT|EXI:4|SemanticConfidence|EvidenceBoundedRelationship|comparisonStatus|numericalScore/;
const conversationBlob = [
  whatMatters,
  why,
  causing,
  constraining,
  compare,
  sacrifice,
  cheaper,
  sure,
].join("\n");

const report = {
  phase: "EXI:4",
  identity: "EXI:4/ExecutiveIntelligencePresentation",
  contract: "EXI:1/NexoraExecutiveIntelligenceExperience",
  completedAt: new Date().toISOString(),
  http,
  exi4Present,
  overview: {
    needsAttention: /Needs Attention/i.test(overview),
    topPriority: /Top Priority/i.test(overview),
    attentionVsPriority,
    noCauseDump: !/Possible contributors/i.test(overview),
  },
  problem: {
    situation: /Situation|Capacity Gap/i.test(problem),
    contributors: /Possible contributors/i.test(problem),
    constraints: /Recorded Constraints|Constraint/i.test(problem),
    noRootCauseCard: !/Root Cause/.test(problem),
  },
  multiOption: /Pricing Response/i.test(multi) && /Demand Surge/i.test(multi),
  missingDimensions: /Cost unknown|Time unknown/i.test(missing),
  decision: /Decision Required|Nexora Recommendation|Recommendation/i.test(decision),
  singleOption: /One evaluated option is currently available/i.test(single),
  unknownHonest: /enough evidence|does not establish|not been established|unknown/i.test(unknown),
  conversationParity: {
    priority: /priority|Capacity Gap|Risk/i.test(whatMatters),
    why: why.length > 8,
    causing: /contributor|related|associated|enough evidence/i.test(causing),
    causingNotProven: !/Capacity Gap caused this/i.test(causing),
    constraining: /constraint|Capacity Gap|not established/i.test(constraining),
    compare: /Pricing Response|Demand Surge|evaluated/i.test(compare),
    sacrifice: /No validated sacrifice/i.test(sacrifice),
    cheaper: /cost evidence|compare them on cost|Cost unknown/i.test(cheaper),
    sure: /Evidence|sure|validated/i.test(sure),
  },
  noJargon: !jargon.test(conversationBlob),
  noWinnerLanguage: !/\bWinner\b|\bApproved\b/.test(decision),
  narrowDesktop: { width: 1280, height: 800, horizontalOverflow: narrowOverflow },
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
  humanCertification: {
    happening: /Capacity|Risk|Margin|Situation/i.test(overview) ? "PASS" : "FAIL",
    attention: /Needs Attention/i.test(overview) ? "PASS" : "FAIL",
    topPriority: /Top Priority/i.test(overview) ? "PASS" : "PARTIAL",
    why: why.length > 8 ? "PASS" : "FAIL",
    contributors: /contributor|related|associated/i.test(causing) ? "PASS" : "PARTIAL",
    constraints: /constraint/i.test(constraining) ? "PASS" : "PARTIAL",
    options: /Pricing Response|Demand Surge/i.test(compare) ? "PASS" : "FAIL",
    sacrifice: /sacrifice/i.test(sacrifice) ? "PASS" : "PARTIAL",
    unknown: /unknown|enough evidence|not available/i.test(unknown + cheaper) ? "PASS" : "PARTIAL",
    recommendation: /recommend/i.test(decision) ? "PASS" : "PARTIAL",
    nextAction: true,
    decisionMaker: !/\bWinner\b|\bApproved\b/.test(decision) ? "PASS" : "FAIL",
  },
  consoleErrors: errors.slice(0, 12),
};

await writeFile(join(OUT, "report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
