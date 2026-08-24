/**
 * NEX-MVP-FINAL:5 — live multi-object investigation on /executive.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  assertCanonicalFocus,
  openExecutiveChat,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const OUT = join(
  process.cwd(),
  ".certification/nex-mvp-final-5-investigation-intelligence",
);
await mkdir(OUT, { recursive: true });
const FALLBACK = /not sure how that relates/i;
const LEAK = /CORE-INT|CC:9|EI:4|\bMO:|MISSING_|READY_FOR_|\bobj-|\bctx-/i;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.on("pageerror", (error) => errors.push(String(error)));
const opened = await openExecutiveChat(page);

const show = await askExecutiveChat(page, "show Delivery");
assertCanonicalFocus(show, "obj-delivery", "show Delivery");
const why = await askExecutiveChat(page, "Why is Delivery below target?");
const explainers = await askExecutiveChat(page, "what could explain it?");
const capacityEvidence = await askExecutiveChat(
  page,
  "what evidence supports Capacity?",
);
await page.screenshot({ path: join(OUT, "01-delivery-why.png") });
const showCapacity = await askExecutiveChat(page, "show Capacity");
const whatElse = await askExecutiveChat(page, "what else could explain it?");
const stronger = await askExecutiveChat(
  page,
  "which explanation has stronger evidence?",
);
const unknown = await askExecutiveChat(page, "what don’t we know?");
const observation = await askExecutiveChat(
  page,
  "Supplier delays increased last month.",
);
const options = await askExecutiveChat(page, "what can we do?");
const increase = await askExecutiveChat(page, "What if we increase Capacity?");
const other = await askExecutiveChat(
  page,
  "What if we address the other issue instead?",
);
const nothing = await askExecutiveChat(page, "What if we do nothing?");
const compare = await askExecutiveChat(page, "Compare them.");
const recommend = await askExecutiveChat(page, "What do you recommend?");
const prefer = await askExecutiveChat(page, "Let's do that.");
const chose = await askExecutiveChat(page, "Why did we choose this?");
await page.screenshot({ path: join(OUT, "02-investigation-close.png") });
const showRisk = await askExecutiveChat(page, "show Risk");
assertCanonicalFocus(showRisk, "obj-risk", "show Risk");
const whyRisk = await askExecutiveChat(page, "Why is Risk at risk?");
const explainRisk = await askExecutiveChat(page, "what could explain it?");
await page.screenshot({ path: join(OUT, "03-risk-investigation.png") });
await browser.close();

const joined = [
  why,
  explainers,
  capacityEvidence,
  whatElse,
  stronger,
  unknown,
  observation,
  options,
  recommend,
  prefer,
  chose,
  whyRisk,
  explainRisk,
]
  .map((turn) => turn.last)
  .join(" ");

const report = {
  phase: "NEX-MVP-FINAL:5",
  http: opened.http,
  identity: opened.identity,
  existingUrl: EXECUTIVE_EXISTING_URL,
  show,
  why,
  explainers,
  capacityEvidence,
  showCapacity,
  whatElse,
  stronger,
  unknown,
  observation,
  options,
  increase,
  other,
  nothing,
  compare,
  recommend,
  prefer,
  chose,
  showRisk,
  whyRisk,
  explainRisk,
  keepsDeliveryInvestigation: /Delivery/i.test(whatElse.last),
  secondInvestigationIsRisk:
    /Risk/i.test(whyRisk.last) && !/91% against a 96%/.test(whyRisk.last),
  noFallback: !FALLBACK.test(joined),
  noCauseCollapse: !/confirmed cause of Delivery|caused Delivery/i.test(joined),
  noObjectIds: !/\bobj-|\bctx-/i.test(
    [increase, other, nothing, compare].map((turn) => turn.last).join(" "),
  ),
  managerReported: /manager-reported/i.test(observation.last),
  preferenceOnly: /Preference noted|no Decision committed/i.test(prefer.last),
  leaks: LEAK.test(joined),
  errors,
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));

const passed =
  report.http === 200 &&
  opened.identity.reference === "NEX-MVP-FINAL:3/natural-reference-v1" &&
  show.focused === "obj-delivery" &&
  report.keepsDeliveryInvestigation &&
  report.secondInvestigationIsRisk &&
  report.noFallback &&
  report.noCauseCollapse &&
  report.noObjectIds &&
  report.managerReported &&
  report.preferenceOnly &&
  report.leaks === false &&
  report.errors.length === 0;

process.exit(passed ? 0 : 1);
