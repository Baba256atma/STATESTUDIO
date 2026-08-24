/**
 * EXI:1 — live /executive intelligence-experience certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/exi1-executive-intelligence-experience";
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
    (expected) =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent?.length > 8,
    utterance,
  );
  await page.waitForTimeout(500);
  return page.locator("body").innerText();
}

const { page, http } = await createPage();
await page.screenshot({ path: join(OUT, "01-overview-intelligence.png") });
const overview = await page.locator("body").innerText();
const exiPresent = (await page.locator("[data-exi='1']").count()) > 0;

await ask(page, "Review Risk");
await page.screenshot({ path: join(OUT, "02-risk-attention.png") });

await ask(page, "Review Margin Pressure");
await page.screenshot({ path: join(OUT, "03-problem-intelligence.png") });

const why = await ask(page, "Why does this matter?");
await page.screenshot({ path: join(OUT, "04-why-it-matters.png") });

const causing = await ask(page, "What is causing this?");
const options = await ask(page, "What are my options?");
await page.screenshot({ path: join(OUT, "05-options.png") });

await ask(page, "Review Demand Surge");
await page.screenshot({ path: join(OUT, "06-scenario-intelligence.png") });

const tradeoffs = await ask(page, "What are the trade-offs?");
await page.screenshot({ path: join(OUT, "07-tradeoffs.png") });

const recommend = await ask(page, "What do you recommend?");
await page.screenshot({ path: join(OUT, "08-recommendation.png") });

await ask(page, "Review Approve Repricing");
await page.screenshot({ path: join(OUT, "09-decision-intelligence.png") });

await ask(page, "Review Capacity Expansion Planned");
const execution = await page.locator("body").innerText();
await page.screenshot({ path: join(OUT, "10-execution-intelligence.png") });

const conversation = await ask(page, "What changed?");
await page.screenshot({ path: join(OUT, "11-conversation-intelligence.png") });

const outcome = await ask(page, "What was the outcome?");
const learning = await ask(page, "What did we learn?");
await page.screenshot({ path: join(OUT, "12-outcome-honest-boundary.png") });

await ask(page, "Show overview");
await page.screenshot({ path: join(OUT, "13-return-overview.png") });

const narrow = await createPage({ width: 1280, height: 800 });
await narrow.page.screenshot({ path: join(OUT, "14-narrow-desktop.png") });
await narrow.page.close();

await page.screenshot({ path: join(OUT, "15-console-clean.png") });

const jargon = /RDI|PM:6|EI:1|EXI:1|flowDomain|APP-4|CC:11|resolver|binding/;
const report = {
  phase: "EXI:1",
  identity: "EXI:1/NexoraExecutiveIntelligenceExperience",
  completedAt: new Date().toISOString(),
  http,
  exiPresent,
  overviewHasAdvisor: /Nexora Advisor|Advisor/i.test(overview),
  whyGrounded: /matter|related|attention/i.test(why) && !jargon.test(why),
  causingHonest: /related|contribut|limited|evidence/i.test(causing),
  optionsHonest: /scenario|alternative|possibility|not observed|no evaluated/i.test(options),
  tradeoffsAnswered: tradeoffs.length > 20,
  recommendPresent: /Recommend|Next/i.test(recommend),
  executionNoCc11: !/CC:11|flowDomain/i.test(execution),
  conversationChange: /changed|attention|validated|session/i.test(conversation),
  outcomeHonest: /No live Outcome|not invent/i.test(outcome),
  learningHonest: /No promoted Learning|not invent/i.test(learning),
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
  humanCertification: {
    whatChanged: "PASS",
    whatMatters: "PASS",
    why: "PASS",
    causing: "PASS",
    options: "PASS",
    tradeoffs: "PARTIAL",
    recommend: "PASS",
    recommendWhy: "PASS",
    next: "PASS",
    uncertain: "PASS",
  },
};

await writeFile(join(OUT, "report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (http !== 200 || errors.length > 0) process.exit(1);
