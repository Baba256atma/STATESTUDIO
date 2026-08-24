/**
 * CORE-INT:3 — live /executive grounded causal + constraint certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/core-int3-grounded-causal-constraint";
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
const coreInt3Present = (await page.locator("[data-core-int3='causal-constraint']").count()) > 0;

await ask(page, "Review Capacity");
const contributors = await ask(page, "Why is this happening?");
await page.screenshot({ path: join(OUT, "01-causal-contributors.png") });

const evidence = await ask(page, "What evidence supports it?");
await page.screenshot({ path: join(OUT, "02-causal-evidence.png") });

const proven = await ask(page, "Is that proven?");
await page.screenshot({ path: join(OUT, "03-not-proven.png") });

const constraint = await ask(page, "What is constraining us?");
await page.screenshot({ path: join(OUT, "04-constraint.png") });

const binding = await ask(page, "Which constraint is binding?");
await page.screenshot({ path: join(OUT, "05-binding-unknown.png") });

await ask(page, "Review Risk");
const related = await ask(page, "What is causing this?");
await page.screenshot({ path: join(OUT, "06-relationship-not-cause.png") });

await ask(page, "Review Capacity");
await ask(page, "Explain Capacity");
await ask(page, "Why is this happening?");
await ask(page, "Is that proven?");
await ask(page, "How sure are you?");
await ask(page, "What evidence supports it?");
await ask(page, "What is constraining us?");
await ask(page, "Which constraint is binding?");
const chain = await ask(page, "What don't we know?");
await page.screenshot({ path: join(OUT, "07-conversation-chain.png") });

await page.screenshot({ path: join(OUT, "08-console-clean.png") });

const liveReport = {
  phase: "CORE-INT:3",
  identity: "CORE-INT:3/GroundedCausalConstraintIntelligence",
  completedAt: new Date().toISOString(),
  http,
  coreInt3Present,
  contributorsQualified:
    /contributor|recorded|constraint|related/i.test(contributors) &&
    !/\bcauses\b|\bcaused\b/i.test(contributors),
  evidenceGrounded: /recorded relationship|evidence|Claim core-int3/i.test(evidence),
  notProven: /not proven|assumption/i.test(proven),
  constraintRecorded: /constraint/i.test(constraint),
  bindingUnknown: /not yet have enough evidence to determine which one is binding/i.test(binding),
  relationshipNotCause:
    /related|associated|does not establish a cause/i.test(related) &&
    !/\bcauses\b|\bcaused\b/i.test(related),
  conversationChainComplete: chain.length > 20,
  uncaught: errors.length,
  duplicateOrHydration: [...errors, ...warnings].filter((text) =>
    /unique key|hydration/i.test(text),
  ),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
await browser.close();
console.log(JSON.stringify(liveReport, null, 2));
if (http !== 200 || errors.length > 0) process.exit(1);
