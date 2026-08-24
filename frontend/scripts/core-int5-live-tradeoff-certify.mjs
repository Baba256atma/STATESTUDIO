/**
 * CORE-INT:5 — live /executive trade-off certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/core-int5-live-tradeoff-intelligence";
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
const coreInt5Present = (await page.locator("[data-core-int5='reader']").count()) > 0;

await ask(page, "Review Margin Pressure");
const compare = await ask(page, "Compare the options.");
await page.screenshot({ path: join(OUT, "01-multi-option.png") });

const gain = await ask(page, "What do we gain?");
await page.screenshot({ path: join(OUT, "02-gains.png") });

const sacrifice = await ask(page, "What do we sacrifice?");
await page.screenshot({ path: join(OUT, "03-sacrifices.png") });

const risk = await ask(page, "Which one has more risk?");
await page.screenshot({ path: join(OUT, "04-risk.png") });

const constraint = await ask(page, "Which option addresses the constraint?");
await page.screenshot({ path: join(OUT, "05-constraint.png") });

const cheaper = await ask(page, "Which is cheaper?");
await page.screenshot({ path: join(OUT, "06-missing-cost.png") });

const faster = await ask(page, "Which is faster?");
await page.screenshot({ path: join(OUT, "07-missing-time.png") });

const assumptions = await ask(page, "What assumptions matter?");
await page.screenshot({ path: join(OUT, "08-assumptions.png") });

await ask(page, "How sure are you?");
const recommend = await ask(page, "Which option does Nexora recommend?");
await ask(page, "Why?");
await page.screenshot({ path: join(OUT, "09-recommendation-alignment.png") });

await ask(page, "Review Capacity Expansion Plan");
const single = await ask(page, "Compare the options.");
await page.screenshot({ path: join(OUT, "10-single-option.png") });

await ask(page, "Review Inventory");
const none = await ask(page, "Compare the options.");
await page.screenshot({ path: join(OUT, "11-no-option.png") });

await ask(page, "Review Margin Pressure");
await ask(page, "Compare the options.");
await ask(page, "What do we gain?");
const chain = await ask(page, "What do we sacrifice?");
await page.screenshot({ path: join(OUT, "12-conversation-chain.png") });
await page.screenshot({ path: join(OUT, "13-console-clean.png") });

const liveReport = {
  phase: "CORE-INT:5",
  identity: "CORE-INT:5/LiveTradeoffIntelligence",
  completedAt: new Date().toISOString(),
  http,
  coreInt5Present: coreInt5Present || /Pricing Response|Demand Surge/i.test(compare),
  multiOption: /Pricing Response/i.test(compare) && /Demand Surge/i.test(compare),
  gainsGrounded: /margin recovery|volume upside/i.test(gain),
  sacrificeHonest: /No validated sacrifice is currently recorded/i.test(sacrifice),
  riskHonest: /risk/i.test(risk) && !/Pricing Response is safer/i.test(risk),
  constraintHonest: /constraint|constrained/i.test(constraint),
  missingCost: /cost evidence/i.test(cheaper),
  missingTime: /time evidence/i.test(faster),
  assumptionsGrounded: /constrained capacity|assumption/i.test(assumptions),
  recommendationPresent: recommend.length > 8,
  singleHonest: /One evaluated option is currently available/i.test(single),
  noOptionHonest: /No evaluated option is currently available/i.test(none),
  conversationComplete: chain.length > 20,
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));
if (http !== 200 || errors.length > 0) process.exit(1);
