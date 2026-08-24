/**
 * NEX-MVP-FINAL:3R — real /executive runtime parity on manager Chat.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  DATABASE_STYLE,
  EXECUTIVE_CERT_URL,
  EXECUTIVE_EXISTING_URL,
  FINAL3_EXPLAIN,
  FINAL3_REFERENCE,
  askExecutiveChat,
  assertCanonicalFocus,
  openExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const OUT = join(process.cwd(), ".certification/nex-mvp-final-3r-runtime-parity");
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));

const existingPage = await browser.newPage({ viewport: { width: 1502, height: 942 } });
existingPage.on("pageerror", (error) => errors.push(String(error)));
const existingOpened = await openExecutivePage(existingPage, EXECUTIVE_EXISTING_URL);
const riskControl = existingPage.locator('[data-testid="nexora-stage-object-control-obj-risk"]');
let stageClickFocused = null;
if ((await riskControl.count()) > 0) {
  await riskControl.click({ force: true });
  await existingPage.waitForTimeout(300);
  stageClickFocused = await existingPage.evaluate(
    () =>
      document
        .querySelector('[data-testid="nexora-executive-shell"]')
        ?.getAttribute("data-focused-subject") ?? null,
  );
}
const existingRisk = await askExecutiveChat(existingPage, "show me risk object");
assertCanonicalFocus(existingRisk, "obj-risk", "existing /executive show me risk object");
await existingPage.close();

const opened = await openExecutiveChat(page);
const entrancePage = await browser.newPage({ viewport: { width: 1502, height: 942 } });
entrancePage.on("pageerror", (error) => errors.push(String(error)));
const entranceOpened = await openExecutivePage(entrancePage, EXECUTIVE_CERT_URL);
await entrancePage.close();
const showRiskObject = await askExecutiveChat(page, "show me risk object");
assertCanonicalFocus(showRiskObject, "obj-risk", "show me risk object");
await page.screenshot({ path: join(OUT, "01-show-risk-object.png") });
const explainRisk = await askExecutiveChat(page, "explain it");
assertCanonicalFocus(explainRisk, "obj-risk", "explain it after risk");
await page.screenshot({ path: join(OUT, "02-explain-risk.png") });
const why = await askExecutiveChat(page, "why?");
assertCanonicalFocus(why, "obj-risk", "why?");
const showDeliveryObject = await askExecutiveChat(page, "show me delivery object");
assertCanonicalFocus(showDeliveryObject, "obj-delivery", "show me delivery object");
await page.screenshot({ path: join(OUT, "03-show-delivery-object.png") });
const explainDelivery = await askExecutiveChat(page, "explain it");
assertCanonicalFocus(explainDelivery, "obj-delivery", "explain it after delivery");
await page.screenshot({ path: join(OUT, "04-explain-delivery.png") });
const showDeliverObject = await askExecutiveChat(page, "show me deliver object");
assertCanonicalFocus(showDeliverObject, "obj-delivery", "show me deliver object");
await page.screenshot({ path: join(OUT, "05-show-deliver-object.png") });
const capacity = await askExecutiveChat(page, "show capacity object");
assertCanonicalFocus(capacity, "obj-capacity", "show capacity object");
const capacityExplain = await askExecutiveChat(page, "explain it");
assertCanonicalFocus(capacityExplain, "obj-capacity", "explain it after capacity");
const inventory = await askExecutiveChat(page, "show inventory object");
assertCanonicalFocus(inventory, "obj-inventory", "show inventory object");
const inventoryExplain = await askExecutiveChat(page, "explain it");
assertCanonicalFocus(inventoryExplain, "obj-inventory", "explain it after inventory");
const riskProblem = await askExecutiveChat(page, "show risk problem");
await page.screenshot({ path: join(OUT, "06-risk-problem.png") });
await browser.close();

function executiveExplain(text, name) {
  return (
    new RegExp(name, "i").test(text) &&
    !DATABASE_STYLE.test(text) &&
    /connected|associated|not enough evidence/i.test(text)
  );
}

const report = {
  phase: "NEX-MVP-FINAL:3R",
  http: opened.http,
  identity: opened.identity,
  entranceIdentity: entranceOpened.identity,
  existingWorkspace: existingOpened.identity,
  existingRisk,
  stageClickFocused,
  showRiskObject,
  explainRisk,
  why,
  showDeliveryObject,
  explainDelivery,
  showDeliverObject,
  capacity,
  capacityExplain,
  inventory,
  inventoryExplain,
  riskProblem,
  sameComposer:
    !DATABASE_STYLE.test(explainRisk.last) &&
    !DATABASE_STYLE.test(explainDelivery.last) &&
    /associated with|connected to/i.test(explainRisk.last) &&
    /associated with|connected to/i.test(explainDelivery.last),
  causalHonest:
    !/(?<!say )Margin Pressure is causing (the )?Risk/i.test(explainRisk.last) &&
    !/(?<!say )Capacity Gap is causing Delivery/i.test(explainDelivery.last) &&
    /not enough evidence|does not by itself tell us/i.test(explainRisk.last) &&
    /not enough evidence|does not by itself tell us/i.test(explainDelivery.last),
  riskProblemAmbiguous:
    riskProblem.focused !== "ctx-problem-margin" &&
    /couldn.t find|more than one|which/i.test(riskProblem.last),
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const passed =
  report.http === 200 &&
  opened.identity.reference === FINAL3_REFERENCE &&
  opened.identity.explain === FINAL3_EXPLAIN &&
  entranceOpened.identity.reference === FINAL3_REFERENCE &&
  existingOpened.identity.reference === FINAL3_REFERENCE &&
  existingRisk.focused === "obj-risk" &&
  (stageClickFocused === "obj-risk" || stageClickFocused === "none") &&
  showRiskObject.focused === "obj-risk" &&
  showDeliveryObject.focused === "obj-delivery" &&
  showDeliverObject.focused === "obj-delivery" &&
  executiveExplain(explainRisk.last, "Risk") &&
  executiveExplain(explainDelivery.last, "Delivery") &&
  report.sameComposer &&
  report.causalHonest &&
  report.riskProblemAmbiguous &&
  why.focused === "obj-risk" &&
  capacityExplain.focused === "obj-capacity" &&
  inventoryExplain.focused === "obj-inventory" &&
  report.errors.length === 0;

process.exit(passed ? 0 : 1);
