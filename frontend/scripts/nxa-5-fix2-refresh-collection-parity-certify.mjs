/** NXA:5-FIX2 — refresh collection presentation and cross-surface parity. */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { EXECUTIVE_EXISTING_URL, askExecutiveChat, openExecutivePage } from "./nex-mvp-final3-executive-chat-harness.mjs";

const url = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const out = join(process.cwd(), ".certification/nxa-5-fix2-refresh-collection-parity");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];

async function snapshot(page) {
  await page.waitForTimeout(250);
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const queue = document.querySelector('[data-testid="nexora-executive-queue"]');
    const snapshotsRaw = stage?.getAttribute("data-stage-collection-snapshots") ?? "[]";
    let rendered = [];
    try { rendered = JSON.parse(snapshotsRaw).map((entry) => entry.subjectId); } catch {}
    const visibleControls = [...document.querySelectorAll('[data-testid^="nexora-stage-object-control-"]')]
      .filter((node) => Number(node.getAttribute("data-opacity") ?? "0") > 0.2)
      .map((node) => node.getAttribute("data-canonical-id"));
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      mode: stage?.getAttribute("data-stage-presentation-mode") ?? "none",
      category: stage?.getAttribute("data-stage-active-queue-category") ?? "none",
      total: Number(stage?.getAttribute("data-stage-collection-total") ?? "0"),
      visible: Number(stage?.getAttribute("data-stage-collection-visible") ?? "0"),
      planarBodies: Number(stage?.getAttribute("data-stage-planar-body-count") ?? "0"),
      rendered,
      visibleControls,
      collectionHeader: queue?.getAttribute("data-collection-header") ?? "none",
      problemCount: Number(document.querySelector('[data-testid="nexora-executive-queue-count-problem"]')?.textContent ?? "0"),
      breadcrumb: document.querySelector('[data-testid="nexora-stage-interaction-breadcrumb"]')?.textContent?.replace(/\s+/g, " ").trim() ?? "",
      journey: {
        phase: shell?.getAttribute("data-mo5-phase") ?? "",
        state: shell?.getAttribute("data-mo5-state") ?? "",
        decision: shell?.getAttribute("data-nxa3-decision") ?? "",
        execution: shell?.getAttribute("data-nxa3-execution") ?? "",
      },
    };
  });
}

async function pageFor(name) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.on("pageerror", (error) => errors.push(`${name}: ${String(error)}`));
  await openExecutivePage(page, url);
  return page;
}

const chatPage = await pageFor("advisor");
await askExecutiveChat(chatPage, "Focus on Margin Pressure.");
const beforeRefresh = await snapshot(chatPage);
await chatPage.reload({ waitUntil: "domcontentloaded" });
await chatPage.waitForSelector('[data-testid="nexora-conversational-input-field"]');
await chatPage.waitForTimeout(800);
const afterRefresh = await snapshot(chatPage);
if (afterRefresh.focused === "none") await askExecutiveChat(chatPage, "Focus on Margin Pressure.");
const advisorReply = await askExecutiveChat(chatPage, "show problems");
const advisor = await snapshot(chatPage);
await chatPage.screenshot({ path: join(out, "advisor-show-problems.png") });

const queuePage = await pageFor("queue");
await askExecutiveChat(queuePage, "Focus on Margin Pressure.");
await queuePage.locator('[data-testid="nexora-executive-queue-disclosure"]').evaluate((node) => { node.open = true; });
await queuePage.locator('[data-testid="nexora-executive-queue-row-problem"]').click();
const queue = await snapshot(queuePage);
await queuePage.screenshot({ path: join(out, "queue-problems.png") });

async function focusFirstRenderedMember(page, state) {
  const id = state.rendered[0];
  if (!id) throw new Error("Collection has no rendered member to focus.");
  await page.locator(`[data-testid="nexora-stage-object-control-${id}"]`).evaluate((node) => node.click());
  await page.waitForTimeout(250);
  return id;
}

async function collectionParity(category, utterance) {
  const advisorPage = await pageFor(`advisor-${category}`);
  await askExecutiveChat(advisorPage, utterance);
  const advisorFocusedMember = await focusFirstRenderedMember(advisorPage, await snapshot(advisorPage));
  const reply = await askExecutiveChat(advisorPage, utterance);
  const advisorState = await snapshot(advisorPage);
  await advisorPage.screenshot({ path: join(out, `advisor-${category}.png`) });
  await advisorPage.close();

  const controlPage = await pageFor(`queue-${category}`);
  await controlPage.locator('[data-testid="nexora-executive-queue-disclosure"]').evaluate((node) => { node.open = true; });
  await controlPage.locator(`[data-testid="nexora-executive-queue-row-${category}"]`).click();
  const queueFocusedMember = await focusFirstRenderedMember(controlPage, await snapshot(controlPage));
  await controlPage.locator('[data-testid="nexora-executive-queue-disclosure"]').evaluate((node) => { node.open = true; });
  await controlPage.locator(`[data-testid="nexora-executive-queue-row-${category}"]`).click();
  const queueState = await snapshot(controlPage);
  await controlPage.screenshot({ path: join(out, `queue-${category}.png`) });
  await controlPage.close();
  return { category, utterance, advisorFocusedMember, queueFocusedMember, reply: reply.last ?? "", advisor: advisorState, queue: queueState };
}

const collectionMatrix = [];
for (const values of [
  ["problem", "show problems"],
  ["scenario", "show scenarios"],
  ["decision", "show decisions"],
  ["execution", "show executions"],
]) collectionMatrix.push(await collectionParity(...values));

const transitionPage = await pageFor("transitions");
const transitionStates = [];
for (const utterance of ["show problems", "show Margin Pressure", "show problems"]) {
  const reply = await askExecutiveChat(transitionPage, utterance);
  transitionStates.push({ utterance, reply: reply.last ?? "", stage: await snapshot(transitionPage) });
}
const shownProblems = transitionStates.at(-1).stage;
const readbackReply = await askExecutiveChat(transitionPage, "what is on stage now?");
const afterReadback = await snapshot(transitionPage);
const judgmentReply = await askExecutiveChat(transitionPage, "which one is more important?");
const afterJudgment = await snapshot(transitionPage);
const whyReply = await askExecutiveChat(transitionPage, "why?");
const afterWhy = await snapshot(transitionPage);
await transitionPage.screenshot({ path: join(out, "readback-judgment.png") });
await transitionPage.close();

const knowledgePage = await pageFor("knowledge");
await askExecutiveChat(knowledgePage, "Focus on Margin Pressure.");
const beforeKnowledge = await snapshot(knowledgePage);
const knowledgeReply = await askExecutiveChat(knowledgePage, "What is Capacity Gap?");
const afterKnowledge = await snapshot(knowledgePage);
await knowledgePage.close();

const rapidPage = await pageFor("rapid");
for (const utterance of ["show problems", "show decisions", "show scenarios", "show problems"]) await askExecutiveChat(rapidPage, utterance);
const afterRapid = await snapshot(rapidPage);
await rapidPage.close();

const navigationPage = await pageFor("navigation");
await askExecutiveChat(navigationPage, "Focus on Margin Pressure.");
await askExecutiveChat(navigationPage, "show problems");
await askExecutiveChat(navigationPage, "Focus on Capacity Gap.");
const beforeBack = await snapshot(navigationPage);
await navigationPage.locator('[data-testid="nexora-stage-step-back"]').click();
const afterBack = await snapshot(navigationPage);
await navigationPage.locator('[data-testid="nexora-stage-step-forward"]').click();
const afterForward = await snapshot(navigationPage);
await navigationPage.close();

await chatPage.close();
await queuePage.close();
await browser.close();

const expectedProblems = ["ctx-problem-capacity", "ctx-problem-margin"].sort();
const sameIds = (actual, expected) => JSON.stringify([...actual].sort()) === JSON.stringify(expected);
const report = {
  identity: "NXA:5-FIX2/RefreshCollectionPresentationParityAdvisorStageHandoff",
  url,
  errors,
  beforeRefresh,
  afterRefresh,
  refreshRestoresFocus: afterRefresh.focused === beforeRefresh.focused,
  advisorReply: advisorReply.last ?? "",
  advisor,
  queue,
  collectionMatrix,
  transitionStates,
  readback: { reply: readbackReply.last ?? "", before: shownProblems, after: afterReadback },
  judgment: { reply: judgmentReply.last ?? "", after: afterJudgment, why: whyReply.last ?? "", afterWhy },
  knowledge: { reply: knowledgeReply.last ?? "", before: beforeKnowledge, after: afterKnowledge },
  rapid: afterRapid,
  navigation: { beforeBack, afterBack, afterForward },
  proofs: {
    advisorMembership: /Capacity Gap/i.test(advisorReply.last ?? "") && /Margin Pressure/i.test(advisorReply.last ?? ""),
    advisorStageProblems: advisor.category === "problem" && sameIds(advisor.rendered, expectedProblems) && advisor.planarBodies === 2,
    queueStageProblems: queue.category === "problem" && sameIds(queue.rendered, expectedProblems) && queue.planarBodies === 2,
    semanticParity: advisor.category === queue.category && sameIds(advisor.rendered, queue.rendered),
    queueCountParity: advisor.problemCount === 2 && queue.problemCount === 2,
    noFocusedResidue: advisor.focused === "none" && queue.focused === "none",
    headerParity: /Problems/i.test(advisor.collectionHeader) && advisor.collectionHeader === queue.collectionHeader,
    genericCollectionParity: collectionMatrix.every((entry) =>
      entry.advisor.category === entry.category &&
      entry.queue.category === entry.category &&
      entry.advisor.focused === "none" &&
      entry.queue.focused === "none" &&
      sameIds(entry.advisor.rendered, entry.queue.rendered) &&
      entry.advisor.planarBodies === entry.advisor.rendered.length &&
      entry.queue.planarBodies === entry.queue.rendered.length &&
      entry.advisor.rendered.length > 0),
    reverseTransitions: transitionStates[0].stage.category === "problem" && transitionStates[0].stage.focused === "none" &&
      transitionStates[1].stage.category === "none" && transitionStates[1].stage.focused === "ctx-problem-margin" &&
      transitionStates[2].stage.category === "problem" && transitionStates[2].stage.focused === "none",
    stageReadback: /Capacity Gap/i.test(readbackReply.last ?? "") && /Margin Pressure/i.test(readbackReply.last ?? "") &&
      sameIds(afterReadback.rendered, shownProblems.rendered) && afterReadback.category === "problem",
    judgmentReadOnly: !/evaluated scenarios/i.test(judgmentReply.last ?? "") && afterJudgment.category === "problem" &&
      sameIds(afterJudgment.rendered, shownProblems.rendered) && afterWhy.category === "problem" && sameIds(afterWhy.rendered, shownProblems.rendered),
    knowledgeReadOnly: /Capacity Gap/i.test(knowledgeReply.last ?? "") &&
      beforeKnowledge.focused === afterKnowledge.focused && beforeKnowledge.category === afterKnowledge.category,
    rapidLatestWins: afterRapid.category === "problem" && sameIds(afterRapid.rendered, expectedProblems) && afterRapid.planarBodies === 2,
    backForwardIntegrity: beforeBack.focused === "ctx-problem-capacity" && afterBack.category === "problem" &&
      sameIds(afterBack.rendered, expectedProblems) && afterForward.focused === "ctx-problem-capacity" && afterForward.category === "none",
    journeySafety: [advisor, queue, ...collectionMatrix.flatMap((entry) => [entry.advisor, entry.queue])]
      .every((state) => !/\bapproved\b/i.test(state.journey.decision) && state.journey.execution !== "STARTED"),
    zeroPageErrors: errors.length === 0,
  },
};
report.ok = Object.values(report.proofs).every(Boolean);
await writeFile(join(out, "runtime-refresh-parity.json"), JSON.stringify(report, null, 2));
if (!report.ok) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log("NXA:5-FIX2 refresh collection parity: ok");
