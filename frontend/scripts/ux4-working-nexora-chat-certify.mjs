/**
 * UX:4 live /executive WebGL + working conversation certification.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const outDir =
  "/Users/bahadoors/Documents/StateStudio/frontend/.certification/ux4-working-nexora-chat";
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
    const canvas = stage?.querySelector("canvas");
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
      canvas: {
        width: canvas?.width ?? 0,
        height: canvas?.height ?? 0,
      },
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
        processing: attr(conversation, "data-processing"),
        status: attr(conversation, "data-experience-status"),
        intent: attr(conversation, "data-intent-kind"),
        context: attr(conversation, "data-context-status"),
        command: attr(conversation, "data-command-kind"),
        primarySubject: attr(conversation, "data-primary-subject"),
        messages,
      },
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 2,
    };
  });
  return { path, state };
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

const report = {
  url,
  viewport: { width: 1502, height: 942 },
  captures: {},
  checks: {},
  notes: [
    "Certification uses the real hydrated client and WebGL canvas.",
    "Conversation responses are produced by the existing deterministic CC pipeline; no LLM/provider is configured.",
  ],
};

await page.goto(url, { waitUntil: "domcontentloaded" });
await waitForExperience();
report.captures.overview = await snapshot("01-overview-chat");

await ask("Hi");
report.captures.greeting = await snapshot("02-hi-response");
report.checks.greetingVisible =
  report.captures.greeting.state.conversation.messages.at(-1)?.role === "nexora";

await ask("What is happening?");
report.checks.situationResponse =
  (await page
    .locator('[data-testid="nexora-conversational-message-nexora"]')
    .last()
    .innerText()).length > 0;

report.checks.capacityClicked = await clickStageObject("obj-capacity");
await ask("Why?");
report.captures.capacityWhy = await snapshot("03-capacity-why");

await ask("What should I do?");
report.captures.capacityRecommendation = await snapshot(
  "04-capacity-recommendation",
);

await ask("What evidence do we have?");
report.captures.capacityEvidence = await snapshot("05-capacity-evidence");

await ask("Focus on Customer");
report.captures.chatFocusCustomer = await snapshot("06-chat-focus-customer");
report.checks.customerCentered =
  report.captures.chatFocusCustomer.state.stage.focused === "obj-customer" &&
  report.captures.chatFocusCustomer.state.stage.anchorPosition === "0,0,0";

await ask("Why does this matter?");
report.captures.customerFollowUp = await snapshot("07-customer-follow-up");
report.checks.customerFollowUpContext =
  report.captures.customerFollowUp.state.conversation.primarySubject ===
  "obj-customer";

await ask("Show overview");
report.captures.chatOverview = await snapshot("08-chat-overview");
report.checks.overviewReset =
  report.captures.chatOverview.state.stage.focused == null ||
  report.captures.chatOverview.state.stage.focused === "" ||
  report.captures.chatOverview.state.stage.focused === "none";

await ask("What happens if we do nothing for 3 months?");
report.captures.scenario = await snapshot("09-scenario-question");

await ask("Do I need to make a decision?");
report.captures.decision = await snapshot("10-decision-question");
report.checks.decisionResponseApplied =
  report.captures.decision.state.conversation.status === "applied";

await ask("What should happen next?");
report.checks.executionResponse =
  (await page
    .locator('[data-testid="nexora-conversational-message-nexora"]')
    .last()
    .innerText()).length > 0;

const field = page.locator('[data-testid="nexora-conversational-input-field"]');
const beforeEmpty = await page.locator(
  '[data-testid^="nexora-conversational-message-"]',
).count();
await field.click();
await field.press("Enter");
await page.waitForTimeout(150);
const afterEmpty = await page.locator(
  '[data-testid^="nexora-conversational-message-"]',
).count();
report.checks.emptyInputIgnored = beforeEmpty === afterEmpty;

report.notes.push(
  "A live technical-failure screenshot was not fabricated: the deterministic in-process CC path has no safe natural provider/network failure trigger.",
);

await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(700);
report.captures.narrow = await snapshot("12-narrow-desktop");
report.checks.narrowNoHorizontalOverflow =
  !report.captures.narrow.state.horizontalOverflow;

report.passed =
  report.checks.greetingVisible &&
  report.checks.situationResponse &&
  report.checks.capacityClicked &&
  report.checks.customerCentered &&
  report.checks.customerFollowUpContext &&
  report.checks.overviewReset &&
  report.checks.decisionResponseApplied &&
  report.checks.executionResponse &&
  report.checks.emptyInputIgnored &&
  report.checks.narrowNoHorizontalOverflow;

await writeFile(
  join(outDir, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
await browser.close();
console.log(JSON.stringify(report, null, 2));
