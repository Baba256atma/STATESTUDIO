/** NPA-T STAGE-PROD:5 — real /executive interaction proof. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const OUT = join(process.cwd(), "artifacts/stage-prod/STAGE-PROD-5");
const URL = process.env.NEXORA_EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL;
const CANONICAL_ID = "ctx-problem-capacity";

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true, timeout: 0 });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});

function assert(value, message) {
  if (!value) throw new Error(message);
}

async function stageSnapshot() {
  return page.evaluate(() => {
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const disclosure = document.querySelector('[data-testid="nexora-theatre-investigation"]');
    const ids = [...document.querySelectorAll('[data-visual-audit="stage-object"]')]
      .map((node) => node.getAttribute("data-canonical-id"))
      .filter(Boolean)
      .sort();
    return {
      selected: mount?.getAttribute("data-selected-object") ?? "none",
      focused: mount?.getAttribute("data-focused-object") ?? "none",
      sceneScript: mount?.getAttribute("data-theatre-scene-script-id") ?? "none",
      compositionSource: mount?.getAttribute("data-stage-prod-composition-source") ?? "none",
      compositionObjectIds: ids,
      disclosureStatus: mount?.getAttribute("data-stage-prod-disclosure-status") ?? "none",
      mountDisclosedObjectId: mount?.getAttribute("data-stage-prod-disclosed-object-id") ?? "none",
      disclosureId: disclosure?.getAttribute("data-stage-prod-disclosed-object-id") ?? "none",
      disclosureText: disclosure?.textContent ?? "",
      disclosureWrites: disclosure?.getAttribute("data-stage-prod-disclosure-writes") ?? "none",
      mountWrites: mount?.getAttribute("data-stage-prod-writes") ?? "none",
    };
  });
}

try {
  const opened = await openExecutivePage(page, URL);
  await askExecutiveChat(page, "show problems");

  const objectList = page.locator('[data-testid="nexora-stage-object-list"]');
  await objectList.evaluate((element) => {
    element.open = true;
  });
  const control = page.locator(
    `[data-testid="nexora-stage-object-control-${CANONICAL_ID}"]`,
  );
  await control.waitFor({ state: "visible" });
  const visibleCanonicalId = await control.getAttribute("data-canonical-id");
  assert(visibleCanonicalId === CANONICAL_ID, `visible Object ID was ${visibleCanonicalId}`);

  await control.focus();
  const focusProof = await control.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      active: document.activeElement === element,
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    };
  });
  await control.press("Enter");
  await page.waitForSelector('[data-testid="nexora-theatre-investigation"]');
  const disclosed = await stageSnapshot();

  assert(disclosed.selected === CANONICAL_ID, `selected ID was ${disclosed.selected}`);
  assert(disclosed.focused === CANONICAL_ID, `focused ID was ${disclosed.focused}`);
  assert(disclosed.disclosureId === CANONICAL_ID, `disclosure ID was ${disclosed.disclosureId}`);
  assert(disclosed.disclosureText.includes("Capacity Gap"), "Capacity Gap disclosure was not visible");
  assert(disclosed.disclosureWrites === "false", "disclosure did not declare read safety");
  assert(disclosed.mountWrites === "false", "Stage did not preserve read safety");

  await page.screenshot({ path: join(OUT, "live-capacity-gap-disclosure.png") });
  const close = page.locator('[data-testid="nexora-theatre-investigation-close"]');
  await close.focus();
  await close.press("Enter");
  await page.waitForSelector('[data-testid="nexora-theatre-investigation"]', {
    state: "detached",
  });
  const dismissed = await stageSnapshot();

  assert(dismissed.selected === CANONICAL_ID, "dismissal changed canonical selection");
  assert(dismissed.focused === CANONICAL_ID, "dismissal changed canonical focus");
  assert(dismissed.disclosureId === "none", "dismissal left disclosure mounted");
  assert(dismissed.mountDisclosedObjectId === "none", "dismissal retained a disclosed Object ID");
  assert(
    dismissed.sceneScript === disclosed.sceneScript &&
      dismissed.compositionSource === disclosed.compositionSource &&
      JSON.stringify(dismissed.compositionObjectIds) === JSON.stringify(disclosed.compositionObjectIds),
    "dismissal changed Stage composition",
  );

  const report = {
    phase: "NPA-T STAGE-PROD:5",
    identity: "NPA-T STAGE-PROD:5/LiveExecutiveInteractionProof",
    url: URL,
    http: opened.http,
    visibleCanonicalId,
    keyboardActivation: focusProof.active,
    focusProof,
    disclosed,
    dismissed,
    zeroConsoleErrors: errors.length === 0,
    errors,
    pass: opened.http === 200 && errors.length === 0,
  };
  await writeFile(join(OUT, "live-executive-interaction.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  assert(report.pass, `live proof had console/page errors: ${errors.join(" | ")}`);
} finally {
  await browser.close();
}
