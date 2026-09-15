/**
 * NPA-T ECA:6 live /executive proofs (short set, max 5).
 * Uses canonical catalog names. Does not start ECA:7.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-6");

async function readEca(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    return {
      intent: shell?.getAttribute("data-eca-2-intent") ?? "none",
      action: shell?.getAttribute("data-eca-2-next-action") ?? "none",
      intervene: shell?.getAttribute("data-eca-3-intervene") ?? "none",
      ask: shell?.getAttribute("data-eca-4-ask") ?? "none",
      bound: shell?.getAttribute("data-eca-5-bound") ?? "none",
      writes5: shell?.getAttribute("data-eca-5-writes") ?? "none",
      objective: shell?.getAttribute("data-eca-6-objective") ?? "none",
      lifecycle: shell?.getAttribute("data-eca-6-lifecycle") ?? "none",
      relation: shell?.getAttribute("data-eca-6-relation") ?? "none",
      milestone: shell?.getAttribute("data-eca-6-milestone") ?? "none",
      currentMilestone: shell?.getAttribute("data-eca-6-current-milestone") ?? "none",
      returnTo: shell?.getAttribute("data-eca-6-return") ?? "none",
      writes6: shell?.getAttribute("data-eca-6-writes") ?? "none",
      secondStore: shell?.getAttribute("data-eca-6-second-store") ?? "none",
      decisions: shell?.getAttribute("data-canonical-decision-count") ?? "0",
      executions: shell?.getAttribute("data-canonical-execution-count") ?? "0",
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

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
await mkdir(out, { recursive: true });

await openExecutivePage(page, url);
const late = await turn(page, "Why are deliveries late?");
const evidence = await turn(page, "Show me the evidence.");
const capacity = await turn(page, "What about Capacity Gap?");
const runtime1 = pass(
  late.objective === "INVESTIGATE_ISSUE" &&
    evidence.objective === "INVESTIGATE_ISSUE" &&
    capacity.objective === "INVESTIGATE_ISSUE" &&
    capacity.writes6 === "false" &&
    capacity.secondStore === "false",
  { late, evidence, capacity },
);

await openExecutivePage(page, url);
const compare = await turn(page, "Compare Demand Surge and Pricing Response.");
const lowerRisk = await turn(page, "Which has lower risk?");
const runtime2 = pass(
  (compare.objective === "COMPARE_OPTIONS" || compare.objective === "EXPLORE_OPTIONS") &&
    compare.writes6 === "false" &&
    Number(compare.decisions ?? "0") === 0,
  { compare, lowerRisk },
);

await openExecutivePage(page, url);
await turn(page, "Compare Demand Surge and Pricing Response.");
const side = await turn(page, "What does CAP_AV mean?");
const resume = await turn(page, "Which issue should we investigate first?");
const runtime3 = pass(
  side.relation === "SIDE_QUESTION" &&
    side.objective === "COMPARE_OPTIONS" &&
    side.writes6 === "false" &&
    resume.objective !== "none" &&
    resume.lifecycle !== "ABANDONED" &&
    resume.secondStore === "false",
  { side, resume },
);

await openExecutivePage(page, url);
await turn(page, "Compare Demand Surge and Pricing Response.");
await turn(page, "Which has lower risk?");
const recommend = await turn(page, "What do you recommend?");
const prefer = await turn(page, "I prefer Demand Surge.");
const runtime4 = pass(
  (recommend.objective === "COMPARE_OPTIONS" || recommend.objective === "PREPARE_RECOMMENDATION") &&
    recommend.intent !== "COMMIT_DECISION" &&
    recommend.writes6 === "false" &&
    prefer.writes6 === "false" &&
    Number(prefer.decisions ?? "0") === 0,
  { recommend, prefer },
);

await openExecutivePage(page, url);
const ready = await turn(page, "Are we ready to execute?");
const yes = await turn(page, "Yes.");
const start = await turn(page, "Start the plan.");
const runtime5 = pass(
  ready.writes6 === "false" &&
    yes.writes6 === "false" &&
    start.writes6 === "false" &&
    Number(ready.executions ?? "0") === 0 &&
    Number(yes.executions ?? "0") === 0 &&
    Number(start.executions ?? "0") === 0 &&
    ready.secondStore === "false",
  { ready, yes, start },
);

const proofs = {
  identity: "NPA-T ECA:6/live-proofs",
  resume: "ECA:6-2026-09-14",
  url,
  comparisonSubjects: [
    { id: "ctx-scenario-demand", name: "Demand Surge" },
    { id: "ctx-scenario-pricing", name: "Pricing Response" },
  ],
  errors,
  "1-investigation-objective-progress": runtime1,
  "2-comparison-objective": runtime2,
  "3-data-detour-resume": runtime3,
  "4-decision-readiness-no-auto-decision": runtime4,
  "5-execution-readiness-start-boundary": runtime5,
};

const allPass = [runtime1, runtime2, runtime3, runtime4, runtime5].every((item) => item.pass);
await writeFile(join(out, "live-proofs.json"), `${JSON.stringify(proofs, null, 2)}\n`);
await page.screenshot({ path: join(out, "live-proofs.png"), fullPage: true });
await browser.close();
if (!allPass || errors.length > 0) {
  console.error(JSON.stringify(proofs, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ passed: true, url, counts: "5/5", pageErrors: errors.length }, null, 2));
