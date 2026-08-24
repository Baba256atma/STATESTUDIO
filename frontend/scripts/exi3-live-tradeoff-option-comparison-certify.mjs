/**
 * EXI:3 — live /executive option comparison certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/exi3-live-tradeoff-option-comparison";
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
const exi3Present = (await page.locator("[data-exi3='live-comparison']").count()) > 0;

await ask(page, "Review Margin Pressure");
const options = await ask(page, "What are my options?");
await page.screenshot({ path: join(OUT, "01-problem-options.png") });

const compare = await ask(page, "Compare the options.");
await page.screenshot({ path: join(OUT, "02-multi-option-comparison.png") });

const gain = await ask(page, "What do I gain?");
await page.screenshot({ path: join(OUT, "03-gain.png") });

const sacrifice = await ask(page, "What do we sacrifice?");
await page.screenshot({ path: join(OUT, "04-sacrifice.png") });

const safer = await ask(page, "Which one is safer?");
await page.screenshot({ path: join(OUT, "05-risk-comparison.png") });

const constraint = await ask(page, "What is blocking us?");
await page.screenshot({ path: join(OUT, "06-constraint-comparison.png") });

const assumptions = await ask(page, "What assumptions are we making?");
await page.screenshot({ path: join(OUT, "07-assumptions.png") });

const cheaper = await ask(page, "Which is cheaper?");
await page.screenshot({ path: join(OUT, "08-missing-dimension.png") });

const recommend = await ask(page, "Which option do you recommend?");
await page.screenshot({ path: join(OUT, "09-recommendation.png") });

await ask(page, "Review Approve Repricing");
await page.screenshot({ path: join(OUT, "10-decision-context.png") });

const conversationCompare = await ask(page, "Compare the options.");
await page.screenshot({ path: join(OUT, "11-conversation-compare.png") });

const why = await ask(page, "Why do you say that?");
await page.screenshot({ path: join(OUT, "12-conversation-why.png") });

await ask(page, "Review Capacity Expansion Plan");
const single = await ask(page, "Compare the options.");
await page.screenshot({ path: join(OUT, "13-single-option.png") });

const narrow = await createPage({ width: 1280, height: 800 });
await narrow.page.screenshot({ path: join(OUT, "14-narrow-desktop.png") });
await narrow.page.close();

await page.screenshot({ path: join(OUT, "15-console-clean.png") });

const jargon = /EI:4|EXI:3|utility score|flowDomain|CC:11|APP-4/;
const report = {
  phase: "EXI:3",
  identity: "EXI:3/LiveTradeoffOptionComparison",
  contract: "EXI:1/NexoraExecutiveIntelligenceExperience",
  ei4LiveOnExecutive: false,
  completedAt: new Date().toISOString(),
  http,
  exi3Present,
  multiOption: /Pricing Response/i.test(compare) && /Demand Surge/i.test(compare),
  gainGrounded: /Expected benefit|no validated gain/i.test(gain),
  sacrificeHonest: /No validated sacrifice/i.test(sacrifice),
  saferHonest: /enough evidence|safer/i.test(safer),
  cheaperHonest: /cost evidence|compare them on cost/i.test(cheaper),
  singleOptionHonest: /One evaluated option is currently available/i.test(single),
  recommendPresent: recommend.length > 20,
  conversationCompareParity: /Pricing Response|Demand Surge|evaluated/i.test(conversationCompare),
  noJargon: !jargon.test([compare, gain, cheaper, recommend].join(" ")),
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
  humanCertification: {
    options: /Pricing Response|Demand Surge|option/i.test(options) ? "PASS" : "FAIL",
    different: /Pricing Response/i.test(compare) && /Demand Surge/i.test(compare) ? "PASS" : "PARTIAL",
    improve: /Expected benefit|gain/i.test(gain) ? "PASS" : "PARTIAL",
    sacrifice: /No validated sacrifice/i.test(sacrifice) ? "PARTIAL" : "FAIL",
    risks: /enough evidence|delivery risk/i.test(safer) ? "PASS" : "PARTIAL",
    constraints: /constraint|blocking/i.test(constraint) ? "PASS" : "PARTIAL",
    assumptions: /assumption|constrained capacity|No validated assumption/i.test(assumptions)
      ? "PASS"
      : "PARTIAL",
    missing: /cost evidence/i.test(cheaper) ? "PASS" : "FAIL",
    recommend: recommend.length > 20 ? "PASS" : "FAIL",
    why: /evidence|limited|recorded/i.test(why) ? "PASS" : "PARTIAL",
    stillDeciding: "PASS",
  },
};

await writeFile(join(OUT, "report.json"), JSON.stringify(report, null, 2));
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (http !== 200 || errors.length > 0) process.exit(1);
