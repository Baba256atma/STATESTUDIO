/**
 * NPA-T ECA:12 live /executive proofs. Isolated reset journeys.
 * Does not start ECA:13.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-12");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    return {
      state11: shell?.getAttribute("data-eca-11-state") ?? "none",
      attribution: shell?.getAttribute("data-eca-11-attribution") ?? "none",
      learning: shell?.getAttribute("data-eca-12-learning") ?? "none",
      closure: shell?.getAttribute("data-eca-12-closure") ?? "none",
      reassess: shell?.getAttribute("data-eca-12-reassess") ?? "none",
      writes12: shell?.getAttribute("data-eca-12-writes") ?? "none",
      app4: shell?.getAttribute("data-eca-12-app4") ?? "none",
      secondEngine: shell?.getAttribute("data-eca-12-second-engine") ?? "none",
      objectiveStore: shell?.getAttribute("data-eca-12-objective-store") ?? "none",
      theatreOutcome: mount?.getAttribute("data-theatre-outcome-observation-state") ?? "none",
    };
  });
}

async function turn(page, utterance) {
  const chat = await askExecutiveChat(page, utterance);
  const eca = await readEca(page);
  return { utterance, reply: chat.last, ...eca };
}

function pass(condition, actual) {
  return { pass: Boolean(condition), actual };
}

async function prepareDecision(page) {
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
  await turn(page, "show scenarios");
  await turn(page, "Compare them.");
  const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
  if ((await reviewBtn.count()) > 0) await reviewBtn.click({ force: true });
  await page.waitForTimeout(300);
  const changeB = page.locator('[data-testid="nexora-theatre-decision-candidate-ctx-scenario-demand"]');
  if ((await changeB.count()) > 0) await changeB.click({ force: true });
  await page.waitForTimeout(300);
  await page.locator('[data-testid="nexora-theatre-decision-commit"]').click({ force: true, timeout: 4000 }).catch(() => null);
  await turn(page, "Approve Demand Surge");
  return turn(page, "Start it.");
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const learned = await turn(page, "What did we learn?");
const runtime1 = pass(
  learned.writes12 === "false" &&
    learned.app4 === "false" &&
    learned.secondEngine === "false" &&
    learned.attribution === "NOT_ESTABLISHED" &&
    /strengthen|bounded|does not establish|doesn[’']t establish/i.test(learned.reply ?? "") &&
    !/capacity caused|always improves/i.test(learned.reply ?? ""),
  learned,
);

await openExecutivePage(page, url);
await prepareDecision(page);
const missing = await turn(page, "What did we learn?");
const runtime2 = pass(
  missing.writes12 === "false" &&
    missing.app4 === "false" &&
    (missing.learning === "NONE" || missing.closure === "WAIT_FOR_EVIDENCE" || /enough evidence|not yet/i.test(missing.reply ?? "")) &&
    !/\bwe learned that\b.*caused/i.test(missing.reply ?? ""),
  missing,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const rethink = await turn(page, "Should we reconsider the approach?");
const runtime3 = pass(
  rethink.writes12 === "false" &&
    rethink.reassess === "true" &&
    !/new Decision has been created|Goal has been changed/i.test(rethink.reply ?? ""),
  rethink,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const done = await turn(page, "I don’t need to investigate the cause. Are we done?");
const runtime4 = pass(
  done.writes12 === "false" &&
    (done.closure === "READY_TO_CLOSE" || /for this review, yes|can close/i.test(done.reply ?? "")),
  done,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Did the Decision improve delivery?");
const blocked = await turn(page, "Are we done?");
const runtime5 = pass(
  blocked.writes12 === "false" &&
    blocked.closure !== "READY_TO_CLOSE" &&
    (blocked.closure === "BLOCKED" || blocked.closure === "WAIT_FOR_EVIDENCE" || /baseline|not for that question|not yet/i.test(blocked.reply ?? "")),
  blocked,
);

await openExecutivePage(page, url);
await turn(page, "Should I worry about CAP_AV?");
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
const cap = await turn(page, "So we proved capacity was the cause.");
const runtime6 = pass(
  cap.writes12 === "false" &&
    cap.app4 === "false" &&
    !/capacity caused/i.test(cap.reply ?? "") &&
    /unconfirmed|doesn[’']t establish|not establish/i.test(cap.reply ?? ""),
  cap,
);

await openExecutivePage(page, url);
await prepareDecision(page);
await turn(page, "Delivery improved from 91% to 94%.");
await turn(page, "That’s enough. Close this review.");
const nextObj = await turn(page, "Now let’s look at supplier cost.");
const runtime7 = pass(
  nextObj.writes12 === "false" &&
    nextObj.objectiveStore === "false" &&
    nextObj.secondEngine === "false",
  nextObj,
);

const proofs = {
  identity: "NPA-T ECA:12/live-proofs",
  url,
  errors,
  "1-bounded-learning": runtime1,
  "2-missing-outcome": runtime2,
  "3-reassessment": runtime3,
  "4-accepted-unknown-closure": runtime4,
  "5-blocking-unknown": runtime5,
  "6-cap-av": runtime6,
  "7-new-objective": runtime7,
};
const keys = Object.keys(proofs).filter((key) => key !== "identity" && key !== "url" && key !== "errors");
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (keys.some((key) => proofs[key].pass === false)) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "7/7" }, null, 2));
