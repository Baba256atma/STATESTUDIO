/** NXA:5-FIX1 — live collection judgment and Stage-awareness certification. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), ".certification/nxa-5-fix1-collection-stage");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [], conversations = [];

async function run(name, utterances) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.on("pageerror", (error) => errors.push(`${name}: ${String(error)}`));
  await openExecutivePage(page, url);
  const turns = [];
  for (const utterance of utterances) {
    const result = await askExecutiveChat(page, utterance);
    const diagnostics = await page.evaluate(() => {
      const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
      return Object.fromEntries(["judgment", "preferred", "recommendation", "strength"].map((key) => [key, shell?.getAttribute(`data-nxa5-${key}`) ?? ""]));
    });
    turns.push({ utterance, response: result.last ?? "", focused: result.focused ?? "", diagnostics });
  }
  await page.screenshot({ path: join(out, `${name}.png`) });
  await page.close(); conversations.push({ name, turns }); return turns;
}

const problems = await run("problems", ["show all problems", "which one is important?", "which problem is more important?", "which one should I investigate first?", "why?", "which one is more urgent?"]);
const scenarios = await run("scenarios", ["show all scenarios", "which one is safer?"]);
const risks = await run("risks", ["show all risks", "which one is most important?"]);
const stage = await run("stage", ["Focus on Margin Pressure.", "Show decisions.", "what is on stage now?", "what is in the center?", "which decisions are shown?", "why are these decisions here?", "explain the stage"]);

await browser.close();
const problemFocus = problems[0].focused;
const stageFocus = stage[1].focused;
const proofs = {
  originalDefectClosed: /Problems|problem|comparable|investigation/i.test(problems[1].response) && !/evaluated scenarios/i.test(problems[1].response),
  overallVsInvestigation: /more important overall|comparable impact evidence/i.test(problems[2].response) && /investigat/i.test(problems[2].response),
  investigationSpecific: /Capacity Gap|Margin Pressure/i.test(problems[3].response) && /investigat/i.test(problems[3].response),
  whyContinuity: problems[4].diagnostics.judgment === "INVESTIGATION_PRIORITY" && /investigat|learning|revers|evidence/i.test(problems[4].response),
  urgencyDistinct: /urgency|urgent|comparable/i.test(problems[5].response) && !/evaluated scenarios/i.test(problems[5].response),
  problemReasoningNoStageMove: problems.slice(1).every((turn) => turn.focused === problemFocus),
  validScenarioPreserved: /Scenario|scenario|safer|risk|comparable/i.test(scenarios[1].response) && scenarios[1].diagnostics.judgment !== "INVESTIGATION_PRIORITY",
  riskDomainPreserved: /Risk|risk|comparable|current/i.test(risks[1].response) && !/evaluated scenarios/i.test(risks[1].response),
  currentStage: /Decisions/i.test(stage[2].response) && /Expand Capacity/i.test(stage[2].response) && /Approve Repricing/i.test(stage[2].response),
  centerAwareness: /does not currently have.*focused/i.test(stage[3].response),
  visibleMembers: /Expand Capacity/i.test(stage[4].response) && /Approve Repricing/i.test(stage[4].response),
  visibilitySafety: /does not.*causal|visibility.*not.*causal/i.test(stage[5].response),
  stageEducation: /visual workspace|current focus|surrounding|objects/i.test(stage[6].response),
  stageReadOnly: stage.slice(2).every((turn) => turn.focused === stageFocus),
  noArchitectureLeakage: [...problems, ...scenarios, ...risks, ...stage].every((turn) => !/NXA|NCA|DIR|resolver|canonical criterion|semantic rank/i.test(turn.response)),
  zeroPageErrors: errors.length === 0,
};
const report = { identity: "NXA:5-FIX1/CollectionJudgmentPrioritySemanticsStageAwareness", url, errors, conversations, proofs, ok: Object.values(proofs).every(Boolean) };
await writeFile(join(out, "runtime-collection-stage.json"), JSON.stringify(report, null, 2));
if (!report.ok) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log("NXA:5-FIX1 live /executive: ok");
