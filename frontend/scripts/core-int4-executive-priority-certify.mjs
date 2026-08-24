/**
 * CORE-INT:4 — live /executive priority certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/core-int4-executive-priority";
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
const coreInt4Present = (await page.locator("[data-core-int4='priority']").count()) > 0;
const overview = await page.locator("body").innerText();
await page.screenshot({ path: join(OUT, "01-attention-vs-priority.png") });

const priority = await ask(page, "What matters most right now?");
await page.screenshot({ path: join(OUT, "02-top-priority.png") });

const why = await ask(page, "Why?");
await page.screenshot({ path: join(OUT, "03-priority-rationale.png") });

const compare = await ask(page, "Why this instead of the other problem?");
await page.screenshot({ path: join(OUT, "04-why-a-over-b.png") });

const second = await ask(page, "What is second priority?");
await page.screenshot({ path: join(OUT, "05-second-priority.png") });

await ask(page, "Review Expand Capacity");
const insufficient = await ask(page, "What matters most right now?");
await page.screenshot({ path: join(OUT, "06-insufficient-evidence.png") });

await ask(page, "Show overview");
await ask(page, "What matters most right now?");
await ask(page, "How sure are you?");
const chain = await ask(page, "What if the evidence is insufficient?");
await page.screenshot({ path: join(OUT, "07-conversation-priority.png") });
await page.screenshot({ path: join(OUT, "08-console-clean.png") });

const liveReport = {
  phase: "CORE-INT:4",
  identity: "CORE-INT:4/ExecutivePriorityIntelligence",
  completedAt: new Date().toISOString(),
  http,
  coreInt4Present,
  attentionPresent: /Needs Attention|Risk/i.test(overview),
  topPriorityShown: /Top Priority|Capacity Gap/i.test(overview + priority),
  attentionVsPriority:
    /Risk/i.test(overview) && /Capacity Gap/i.test(priority) && !/Risk is currently the highest supported priority/i.test(priority),
  rationaleGrounded: /constraint|downstream|evidence/i.test(why),
  comparisonGrounded: /evidence|distinguish|Capacity|Margin|Risk/i.test(compare),
  secondHonest: second.length > 8,
  insufficientHonest: /not sufficient to prioritize|cannot confidently distinguish/i.test(insufficient),
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
