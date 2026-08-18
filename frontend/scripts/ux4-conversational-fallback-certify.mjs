/**
 * UX:4-FIX live /executive contextual conversational fallback certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const outDir =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux4-conversational-fallback";
const url = "http://127.0.0.1:3000/executive";

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45000);

async function waitForExperience() {
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux2="stage-interaction"]');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
  await page.waitForTimeout(700);
}

async function ask(utterance) {
  const field = page.locator(
    '[data-testid="nexora-conversational-input-field"]',
  );
  await field.click();
  await field.pressSequentially(utterance);
  await field.press("Enter");
  await page.waitForSelector('[data-testid="nexora-conversational-thinking"]');
  await page.waitForSelector('[data-testid="nexora-conversational-thinking"]', {
    state: "detached",
  });
  await page.waitForTimeout(150);
  return page
    .locator('[data-testid="nexora-conversational-message-nexora"]')
    .last()
    .innerText();
}

async function openObjectsList() {
  const list = page.locator('[data-testid="nexora-stage-object-list"]');
  const open = await list.evaluate(
    (element) => element.hasAttribute("open") || element.open === true,
  );
  if (!open) {
    await list.locator("summary").click();
    await page.waitForTimeout(150);
  }
}

async function clickStageObject(id) {
  await openObjectsList();
  const control = page.locator(
    `[data-testid="nexora-stage-object-control-${id}"]`,
  );
  if ((await control.count()) === 0) return false;
  await control.click();
  await page.waitForTimeout(650);
  return true;
}

async function snapshot(name) {
  const path = join(outDir, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  const state = await page.evaluate(() => {
    const stage = document.querySelector(
      '[data-testid="nexora-3d-executive-stage"]',
    );
    const advisor = document.querySelector(
      '[data-testid="nexora-advisor-insight-region"]',
    );
    const conversation = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    const attr = (element, name) => element?.getAttribute(name) ?? null;
    const messages = [
      ...document.querySelectorAll(
        '[data-testid^="nexora-conversational-message-"]',
      ),
    ].map((element) => ({
      role: element
        .getAttribute("data-testid")
        ?.replace("nexora-conversational-message-", ""),
      status: attr(element, "data-message-status"),
      text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
    }));
    return {
      ux1:
        document.querySelector('[data-ux1="simplify-executive-page"]') != null,
      ux2: attr(stage, "data-ux2"),
      ux3: attr(advisor, "data-ux3"),
      stage: {
        focused: attr(stage, "data-stage-focused-object-id"),
        anchor: attr(stage, "data-stage-anchor-object-id"),
        anchorPosition: attr(stage, "data-stage-anchor-position"),
        cameraMode: attr(stage, "data-stage-camera-mode"),
        depth: attr(stage, "data-stage-depth"),
      },
      advisor: {
        subject: attr(advisor, "data-advisor-subject"),
        grammar: attr(advisor, "data-advisor-grammar"),
      },
      conversation: {
        status: attr(conversation, "data-experience-status"),
        intent: attr(conversation, "data-intent-kind"),
        context: attr(conversation, "data-context-status"),
        command: attr(conversation, "data-command-kind"),
        primarySubject: attr(conversation, "data-primary-subject"),
        messages,
      },
      parserLeakage: messages.some((message) =>
        /map(?:ped)? .*command|unsupported intent|resolver failed/i.test(
          message.text,
        ),
      ),
    };
  });
  return { path, state };
}

const report = {
  url,
  viewport: { width: 1502, height: 942 },
  captures: {},
  checks: {},
  notes: [
    "Certification uses the real hydrated client and WebGL Stage.",
    "Contextual explanations consume the existing UX:3 Professional Advisor projection.",
    "No LLM/provider was added; fallback remains deterministic and grounded.",
  ],
};

await page.goto(url, { waitUntil: "domcontentloaded" });
await waitForExperience();

const overviewExplain = await ask("explain");
report.captures.overviewExplain = await snapshot("01-overview-explain");
report.checks.overviewExplain =
  /Executive Overview/.test(overviewExplain) &&
  /No explicit subject is selected/.test(overviewExplain);

report.checks.capacityClicked = await clickStageObject("obj-capacity");
const capacityExplain = await ask("explain");
report.captures.capacityExplain = await snapshot("02-capacity-explain");
report.checks.capacityExplain =
  /Capacity/.test(capacityExplain) &&
  /Recommendation:/.test(capacityExplain);

const capacityWhy = await ask("Why?");
report.captures.capacityWhy = await snapshot("03-capacity-why");
report.checks.capacityWhy =
  /Capacity/.test(capacityWhy) &&
  report.captures.capacityWhy.state.conversation.primarySubject ===
    "obj-capacity";

const capacityRecommendation = await ask("What should I do?");
report.captures.capacityRecommendation = await snapshot(
  "04-capacity-recommendation",
);
report.checks.capacityRecommendation =
  /Recommendation:/.test(capacityRecommendation);

report.checks.customerClicked = await clickStageObject("obj-customer");
const customerMore = await ask("tell me more");
report.captures.customerMore = await snapshot("05-customer-tell-me-more");
report.checks.customerMore =
  /Customer/.test(customerMore) &&
  report.captures.customerMore.state.conversation.primarySubject ===
    "obj-customer";

await ask("Focus on Capacity");
report.captures.explicitCommand = await snapshot(
  "06-explicit-command-regression",
);
report.checks.explicitCommand =
  report.captures.explicitCommand.state.stage.focused === "obj-capacity" &&
  report.captures.explicitCommand.state.stage.anchorPosition === "0,0,0" &&
  report.captures.explicitCommand.state.stage.cameraMode === "fixed-2d" &&
  report.captures.explicitCommand.state.stage.depth === "0" &&
  report.captures.explicitCommand.state.advisor.subject === "obj-capacity";

const unknown = await ask("purple elephant protocol");
report.captures.safeUnknown = await snapshot("07-safe-unknown-fallback");
report.checks.safeUnknown =
  /not sure how that relates/i.test(unknown) &&
  !report.captures.safeUnknown.state.parserLeakage;

report.checks.oldParserErrorAbsent = !Object.values(report.captures).some(
  (capture) => capture.state.parserLeakage,
);
report.passed = Object.values(report.checks).every(Boolean);

await writeFile(
  join(outDir, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
