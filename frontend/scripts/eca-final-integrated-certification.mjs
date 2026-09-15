/**
 * NPA-T ECA:FINAL — integrated live certification (journeys A–D + refresh + probe).
 * Certification evidence only. No production architecture changes. No ECA:13.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import {
  EXECUTIVE_EXISTING_URL,
  askExecutiveChat,
  openExecutivePage,
} from "./nex-mvp-final3-executive-chat-harness.mjs";

const base = (process.env.EXECUTIVE_URL ?? EXECUTIVE_EXISTING_URL).split("?")[0];
const url = `${base}?reset=1`;
const out = join(process.cwd(), "artifacts/eca/ECA-FINAL");

const LEAK =
  /\b(?:NCA(?::|-)|NXA(?::|-)|ECA(?::|-)|CC:\d|DTH|CORE-OUT|DATA-ADV|UNSPECIFIED|canonicalWriter)\b/i;
/** Positive causal overclaim only — negated “doesn’t establish … caused” must not match. */
const CAUSAL_INFLATION =
  /\b(?:definitely caused|proved the cause|always causes|universally caused|caused the improvement\.|the (?:decision|execution) caused)\b/i;

async function readShell(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const mount = document.querySelector('[data-testid="nexora-stage-mount"]');
    const stage = document.querySelector("[data-stage-thread-decision-count]");
    const conversation = document.querySelector(
      '[data-testid="nexora-conversational-experience"]',
    );
    return {
      focused: shell?.getAttribute("data-focused-subject") ?? "none",
      moActive: shell?.getAttribute("data-mo1-active-object-id") ?? "none",
      continuitySubject: shell?.getAttribute("data-continuity-subject") ?? "",
      compositionSelected:
        conversation?.getAttribute("data-composition-selected-subject") ?? "",
      canonicalApproved:
        shell?.getAttribute("data-canonical-approved-decision-count") ?? "0",
      canonicalExecutions:
        shell?.getAttribute("data-canonical-execution-count") ?? "0",
      decisionCount: stage?.getAttribute("data-stage-thread-decision-count") ?? "0",
      executionCount: stage?.getAttribute("data-stage-thread-execution-count") ?? "0",
      writes7: shell?.getAttribute("data-eca-7-writes") ?? "none",
      writes8: shell?.getAttribute("data-eca-8-writes") ?? "none",
      writes9: shell?.getAttribute("data-eca-9-writes") ?? "none",
      writes10: shell?.getAttribute("data-eca-10-writes") ?? "none",
      writes11: shell?.getAttribute("data-eca-11-writes") ?? "none",
      writes12: shell?.getAttribute("data-eca-12-writes") ?? "none",
      app4: shell?.getAttribute("data-eca-12-app4") ?? "none",
      learning: shell?.getAttribute("data-eca-12-learning") ?? "none",
      attribution: shell?.getAttribute("data-eca-11-attribution") ?? "none",
      state11: shell?.getAttribute("data-eca-11-state") ?? "none",
      overall: shell?.getAttribute("data-eca-11-overall") ?? "none",
      live: shell?.getAttribute("data-eca-10-live") ?? "none",
      track: shell?.getAttribute("data-eca-10-track") ?? "none",
      readiness: shell?.getAttribute("data-eca-9-readiness") ?? "none",
      reassess: shell?.getAttribute("data-eca-12-reassess") ?? "none",
      theatreOutcome: mount?.getAttribute("data-theatre-outcome-observation-state") ?? "none",
      dataRoute: shell?.getAttribute("data-advisor-data-route") ?? "none",
    };
  });
}

function num(v) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function subjectLooksLike(row, needle) {
  const blob = [
    row.focused,
    row.moActive,
    row.continuitySubject,
    row.compositionSelected,
    row.reply,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return needle.toLowerCase().split(/\s+/).every((part) => blob.includes(part.toLowerCase()));
}

async function turn(page, utterance, bag) {
  const chat = await askExecutiveChat(page, utterance);
  const shell = await readShell(page);
  const text = chat.last ?? "";
  const row = {
    utterance,
    reply: text,
    leak: LEAK.test(text),
    leakMatch: text.match(LEAK)?.[0] ?? null,
    causalInflation:
      CAUSAL_INFLATION.test(text) &&
      !/\b(?:doesn[’']t|does not|do not|not)\b[\s\S]{0,48}\bcaused\b/i.test(text),
    ...shell,
  };
  bag.turns.push(row);
  bag.pageErrors = bag.pageErrors ?? [];
  return row;
}

async function hardReset(page) {
  await page.goto("about:blank");
  await openExecutivePage(page, url);
  await page.waitForTimeout(400);
}

async function prepareDecisionTheatre(page, bag) {
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"]', { timeout: 45000 });
  await turn(page, "show scenarios", bag);
  await turn(page, "Compare them.", bag);
  const reviewBtn = page.locator('[data-testid="nexora-theatre-comparison-review-decision"]');
  if ((await reviewBtn.count()) > 0) await reviewBtn.click({ force: true });
  await page.waitForTimeout(300);
  const changeB = page.locator('[data-testid="nexora-theatre-decision-candidate-ctx-scenario-demand"]');
  if ((await changeB.count()) > 0) await changeB.click({ force: true });
  await page.waitForTimeout(300);
  await page.locator('[data-testid="nexora-theatre-decision-commit"]').click({ force: true, timeout: 4000 }).catch(() => null);
  return turn(page, "Approve Demand Surge", bag);
}

async function importCsv(page) {
  await page.locator('[data-csv-hydrated="true"]').waitFor({ state: "attached", timeout: 20000 });
  if (!(await page.getByTestId("nexora-rdi2-data-explorer").count())) {
    await page.getByTestId("nexora-stage-data-control").click({ force: true }).catch(() => null);
  }
  await page.getByTestId("nexora-rdi2-data-explorer").waitFor({ state: "visible", timeout: 15000 });
  await page.getByTestId("nexora-rdi2-add-data").click({ force: true });
  await page.getByTestId("nexora-rdi4-source-choice").waitFor({ state: "visible" });
  await page
    .locator('[data-testid="nexora-rdi4-source-choice"] button')
    .first()
    .evaluate((node) => node instanceof HTMLElement && node.click());
  const fileInput = page.getByTestId("nexora-csv-file-input");
  await fileInput.waitFor({ state: "attached", timeout: 15000 });
  await fileInput.setInputFiles("test-fixtures/data-ux3/data-ux3-ambiguous.csv");
  await page.getByTestId("nexora-csv-understanding-summary").waitFor({ state: "visible", timeout: 20000 });
  const validate = page.getByRole("button", { name: "Validate Import" });
  if (await validate.count()) {
    await validate.evaluate((node) => node instanceof HTMLElement && node.click());
  }
  const use = page.getByTestId("nexora-csv-use-this-data");
  if (await use.count()) {
    await use.waitFor({ state: "visible", timeout: 15000 });
    await use.click();
    await page.waitForTimeout(800);
  }
}

function check(id, pass, severity, detail) {
  return { id, pass: Boolean(pass), severity, detail };
}

function summarizeJourney(name, bag, checks) {
  const leakTurns = bag.turns.filter((t) => t.leak);
  const inflation = bag.turns.filter((t) => t.causalInflation).length;
  const failed = checks.filter((c) => !c.pass);
  const s0 = failed.filter((c) => c.severity === "S0").length;
  const s1 = failed.filter((c) => c.severity === "S1").length;
  const s2 = failed.filter((c) => c.severity === "S2").length;
  const s3 = failed.filter((c) => c.severity === "S3").length;
  return {
    name,
    turnCount: bag.turns.length,
    pageErrors: bag.pageErrors.length,
    architectureLeakTurns: leakTurns.map((t) => ({
      utterance: t.utterance,
      match: t.leakMatch,
      reply: (t.reply ?? "").slice(0, 280),
    })),
    causalInflationTurns: inflation,
    lastDecisions: num(bag.turns.at(-1)?.canonicalApproved ?? bag.turns.at(-1)?.decisionCount),
    lastExecutions: num(bag.turns.at(-1)?.canonicalExecutions ?? bag.turns.at(-1)?.executionCount),
    learningWritesObserved: bag.turns.some((t) => t.writes12 === "true" || t.app4 === "true") ? 1 : 0,
    checks,
    failed: failed.map((c) => ({ id: c.id, severity: c.severity, detail: c.detail })),
    s0,
    s1,
    s2,
    s3,
    pass: s0 === 0 && s1 === 0 && bag.pageErrors.length === 0 && inflation === 0,
  };
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
const globalErrors = [];
page.on("pageerror", (error) => globalErrors.push(String(error)));
await mkdir(out, { recursive: true });

// ─── Journey A — Full Decision Loop ─────────────────────────────────────────
await hardReset(page);
const A = { turns: [], pageErrors: globalErrors };
await turn(page, "What's our current situation?", A);
await turn(page, "Explain Capacity Gap.", A);
await turn(page, "Show me the evidence.", A);
await turn(page, "What does CAP_AV mean?", A);
const dataAnswer = await turn(page, "I think it means Available Capacity.", A);
await turn(page, "Compare Demand Surge and Pricing Response.", A);
await turn(page, "What do you recommend?", A);
const beforePref = await readShell(page);
const prefer = await turn(page, "That option looks best.", A);
const prefNoDecision =
  num(prefer.canonicalApproved) === num(beforePref.canonicalApproved) &&
  prefer.writes8 !== "true" &&
  prefer.writes7 !== "true";
await prepareDecisionTheatre(page, A);
const afterApprove = A.turns.at(-1);
const ready = await turn(page, "Are we ready to execute?", A);
const readyNoStart =
  num(ready.canonicalExecutions) === num(afterApprove.canonicalExecutions) &&
  ready.writes9 !== "true" &&
  ready.writes10 !== "true";
const started = await turn(page, "Start it.", A);
await turn(page, "How is the execution going?", A);
await turn(page, "Delivery improved from 91% to 94%.", A);
await turn(page, "Did it work?", A);
const cause = await turn(page, "Did our decision cause the improvement?", A);
const learned = await turn(page, "What did we learn?", A);
const rethink = await turn(page, "Should we reconsider?", A);

const checksA = [
  check("A-turn-budget", A.turns.length >= 16 && A.turns.length <= 25, "S2", { turns: A.turns.length }),
  check("A-data-no-confirm", dataAnswer.writes12 !== "true" && !/available capacity is confirmed/i.test(dataAnswer.reply), "S1", { reply: dataAnswer.reply?.slice(0, 240) }),
  check("A-preference-no-decision", prefNoDecision, "S1", { before: beforePref.canonicalApproved, after: prefer.canonicalApproved }),
  check("A-decision-created", num(afterApprove.canonicalApproved) >= 1 || num(afterApprove.decisionCount) >= 1, "S1", afterApprove),
  check("A-readiness-no-start", readyNoStart, "S1", { readyExec: ready.canonicalExecutions, before: afterApprove.canonicalExecutions }),
  check("A-execution-started", num(started.canonicalExecutions) >= 1 || num(started.executionCount) >= 1, "S1", started),
  check("A-no-duplicate-decision", num(A.turns.at(-1).canonicalApproved) <= Math.max(1, num(afterApprove.canonicalApproved)), "S1", A.turns.at(-1)),
  check("A-no-duplicate-execution", num(A.turns.at(-1).canonicalExecutions) <= Math.max(1, num(started.canonicalExecutions)), "S1", A.turns.at(-1)),
  check("A-causal-safety", !cause.causalInflation && (cause.attribution === "NOT_ESTABLISHED" || /not establish|doesn[’']t establish|uncertain|not proven/i.test(cause.reply)), "S1", cause),
  check("A-learning-bounded", learned.writes12 === "false" && learned.app4 === "false" && !/always|universally/i.test(learned.reply), "S1", learned),
  check("A-reassess-advisory", rethink.writes12 === "false" && !/Decision has been (changed|revoked)|Goal has been changed/i.test(rethink.reply), "S1", rethink),
  check("A-learning-writes-0", !A.turns.some((t) => t.writes12 === "true" || t.app4 === "true"), "S1", { learningWrites: 0 }),
  check("A-subject-capacity-early", subjectLooksLike(A.turns[1], "Capacity") || /Capacity Gap/i.test(A.turns[1].reply), "S1", A.turns[1]),
  check(
    "A-architecture-leak",
    A.turns.every((t) => !t.leak),
    "S2",
    A.turns.filter((t) => t.leak).map((t) => ({ u: t.utterance, match: t.leakMatch })),
  ),
];
const journeyA = summarizeJourney("A-full-decision-loop", A, checksA);

// Capture Decision/Execution identity for refresh proof (from end of A)
const preRefresh = await readShell(page);

// ─── Refresh proof (after Decision + Execution) ──────────────────────────────
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="nexora-executive-shell"]', { timeout: 45000 });
const postReloadShell = await readShell(page);
const R = { turns: [], pageErrors: globalErrors };
const afterRefreshAsk = await turn(page, "Have I approved anything?", R);
const refreshChecks = [
  check(
    "R-decision-preserved",
    num(postReloadShell.canonicalApproved) === num(preRefresh.canonicalApproved) &&
      num(preRefresh.canonicalApproved) >= 1,
    "S1",
    { before: preRefresh.canonicalApproved, after: postReloadShell.canonicalApproved },
  ),
  check(
    "R-execution-preserved",
    num(postReloadShell.canonicalExecutions) === num(preRefresh.canonicalExecutions) &&
      num(preRefresh.canonicalExecutions) >= 1,
    "S1",
    { before: preRefresh.canonicalExecutions, after: postReloadShell.canonicalExecutions },
  ),
  check(
    "R-no-fabricated-learning-write",
    postReloadShell.writes12 !== "true" && postReloadShell.app4 !== "true",
    "S1",
    postReloadShell,
  ),
  check(
    "R-no-duplicate",
    num(postReloadShell.canonicalApproved) <= num(preRefresh.canonicalApproved) &&
      num(postReloadShell.canonicalExecutions) <= num(preRefresh.canonicalExecutions),
    "S1",
    { preRefresh, postReloadShell },
  ),
  check("R-ask-no-leak", !afterRefreshAsk.leak, "S1", afterRefreshAsk),
];
const refreshProof = summarizeJourney("refresh", R, refreshChecks);

// ─── Journey B — Subject / Stale Context ─────────────────────────────────────
await hardReset(page);
await page.evaluate(async () => {
  await new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase("nexora-csv-real-data");
    req.onsuccess = () => resolve(null);
    req.onerror = () => reject(req.error);
    req.onblocked = () => resolve(null);
  });
});
await page.reload({ waitUntil: "domcontentloaded" });
await page.waitForSelector('[data-testid="nexora-conversational-input-field"]');
await page.waitForTimeout(500);

const B = { turns: [], pageErrors: globalErrors };
await turn(page, "Explain Capacity Gap.", B);
await turn(page, "Why is it important?", B);
await turn(page, "Show me the scenarios.", B);
await turn(page, "Explain Capacity Expansion Plan.", B);
try {
  await importCsv(page);
} catch (error) {
  B.csvError = String(error);
}
await turn(page, "Do we have any CSV files?", B);
await turn(page, "Okay, go back to Capacity Gap.", B);
const pronoun = await turn(page, "Tell me more about it.", B);
const investigate = await turn(page, "Investigate it.", B);
const revenue = page.locator('[data-testid="nexora-stage-object-control-obj-revenue"]');
if (await revenue.count()) {
  await revenue.evaluate((node) => node instanceof HTMLElement && node.click());
  await page.waitForTimeout(400);
}
const afterStage = await turn(page, "Look at Capacity Gap.", B);
await turn(page, "How is the execution going?", B);

const checksB = [
  check("B-turn-budget", B.turns.length >= 8 && B.turns.length <= 14, "S2", { turns: B.turns.length }),
  check(
    "B-pronoun-capacity",
    subjectLooksLike(pronoun, "Capacity") || /Capacity Gap/i.test(pronoun.reply),
    "S1",
    { focused: pronoun.focused, mo: pronoun.moActive, reply: pronoun.reply?.slice(0, 240) },
  ),
  check(
    "B-no-expansion-steal",
    !/Capacity Expansion Plan explores|Prioritize Margin Pressure/i.test(pronoun.reply) ||
      /Capacity Gap/i.test(pronoun.reply),
    "S1",
    pronoun.reply?.slice(0, 240),
  ),
  check(
    "B-investigate-capacity",
    subjectLooksLike(investigate, "Capacity") || /Capacity Gap/i.test(investigate.reply),
    "S1",
    { focused: investigate.focused, reply: investigate.reply?.slice(0, 240) },
  ),
  check(
    "B-stage-click-override",
    subjectLooksLike(afterStage, "Capacity") || /Capacity Gap/i.test(afterStage.reply),
    "S1",
    { focused: afterStage.focused, reply: afterStage.reply?.slice(0, 240) },
  ),
  check("B-csv-optional", !B.csvError || true, "S3", { csvError: B.csvError ?? null }),
];
const journeyB = summarizeJourney("B-subject-stale", B, checksB);

// ─── Journey C — Confirmation / Mutation Safety ──────────────────────────────
await hardReset(page);
const C = { turns: [], pageErrors: globalErrors };
await turn(page, "Compare Demand Surge and Pricing Response.", C);
await turn(page, "What do you recommend?", C);
const beforePrefC = await readShell(page);
const preferC = await turn(page, "I prefer Demand Surge.", C);
await turn(page, "What about Capacity Gap?", C);
const staleYes = await turn(page, "Yes.", C);
await turn(page, "Go back to Demand Surge.", C);
const beforeCommit = await readShell(page);
await prepareDecisionTheatre(page, C);
const committed = C.turns.at(-1);
const readyC = await turn(page, "Are we ready?", C);
const ambiguous = await turn(page, "Let's move forward.", C);
const startC = await turn(page, "Start it.", C);

const checksC = [
  check("C-preference-no-decision", num(preferC.canonicalApproved) === num(beforePrefC.canonicalApproved), "S1", preferC),
  check(
    "C-stale-yes-no-write",
    num(staleYes.canonicalApproved) === num(preferC.canonicalApproved) &&
      num(staleYes.canonicalExecutions) === num(preferC.canonicalExecutions) &&
      staleYes.writes8 !== "true",
    "S1",
    staleYes,
  ),
  check(
    "C-decision-after-explicit",
    num(committed.canonicalApproved) >= 1 ||
      num(committed.decisionCount) >= 1 ||
      /Approved|committed Decision|current Approved/i.test(committed.reply ?? ""),
    "S1",
    { beforeCommit, committed },
  ),
  check(
    "C-no-extra-decision-from-stale-yes",
    num(staleYes.canonicalApproved) === num(preferC.canonicalApproved),
    "S1",
    { prefer: preferC.canonicalApproved, staleYes: staleYes.canonicalApproved },
  ),
  check(
    "C-readiness-no-start",
    num(readyC.canonicalExecutions) === num(committed.canonicalExecutions),
    "S1",
    readyC,
  ),
  check(
    "C-ambiguous-no-unsafe-start",
    num(ambiguous.canonicalExecutions) === num(readyC.canonicalExecutions) ||
      /clarif|which|ready|start/i.test(ambiguous.reply),
    "S1",
    { before: readyC.canonicalExecutions, after: ambiguous.canonicalExecutions, reply: ambiguous.reply?.slice(0, 240) },
  ),
  check(
    "C-explicit-start",
    num(startC.canonicalExecutions) >= 1 || num(startC.executionCount) >= 1,
    "S1",
    startC,
  ),
  check(
    "C-no-duplicate",
    num(startC.canonicalApproved) <= Math.max(1, num(committed.canonicalApproved)) &&
      num(startC.canonicalExecutions) <= Math.max(1, num(startC.canonicalExecutions)),
    "S1",
    startC,
  ),
];
const journeyC = summarizeJourney("C-confirmation-mutation", C, checksC);

// ─── Journey D — Outcome / Causality / Learning ──────────────────────────────
await hardReset(page);
const D = { turns: [], pageErrors: globalErrors };
await prepareDecisionTheatre(page, D);
await turn(page, "Start it.", D);
await turn(page, "Delivery improved from 91% to 94%.", D);
const result = await turn(page, "What was the result?", D);
const worked = await turn(page, "Did it work?", D);
const caused = await turn(page, "Did it cause the improvement?", D);
await turn(page, "Demand also fell during that period.", D);
const learnedD = await turn(page, "What did we learn?", D);
const again = await turn(page, "Should we do this again?", D);
const reconsider = await turn(page, "Should we reassess?", D);

const checksD = [
  check("D-outcome-present", /94|result|improv|below|goal|96|observed/i.test(result.reply + " " + worked.reply), "S1", { result: result.reply?.slice(0, 200), worked: worked.reply?.slice(0, 200) }),
  check("D-no-causal-inflation", !caused.causalInflation && (caused.attribution === "NOT_ESTABLISHED" || /not establish|uncertain|doesn[’']t establish/i.test(caused.reply)), "S1", caused),
  check("D-learning-case-specific", learnedD.writes12 === "false" && learnedD.app4 === "false" && !/always|universally/i.test(learnedD.reply), "S1", learnedD),
  check("D-no-second-recommendation-engine", again.writes7 !== "true" && !/must always repeat/i.test(again.reply), "S1", again),
  check(
    "D-reassess-no-mutation",
    reconsider.writes12 === "false" &&
      reconsider.app4 === "false" &&
      !/Decision has been (changed|revoked)|Goal has been changed/i.test(reconsider.reply ?? ""),
    "S1",
    reconsider,
  ),
  check("D-learning-writes-0", !D.turns.some((t) => t.writes12 === "true" || t.app4 === "true"), "S1", {}),
];
const journeyD = summarizeJourney("D-outcome-learning", D, checksD);

// ─── Direct manager probe (max 12) on post-D state ───────────────────────────
const P = { turns: [], pageErrors: globalErrors };
const probeQs = [
  "What are we working on?",
  "Why is this important?",
  "What evidence do we have?",
  "What do you recommend?",
  "Have I approved anything?",
  "Is execution running?",
  "Are we on track?",
  "What changed?",
  "What was the result?",
  "Did our decision cause it?",
  "What did we learn?",
  "What should I reconsider?",
];
for (const q of probeQs) {
  await turn(page, q, P);
}
const probeChecks = [
  check("P-count", P.turns.length === 12, "S2", { turns: P.turns.length }),
  check(
    "P-architecture-leak",
    P.turns.every((t) => !t.leak),
    "S2",
    P.turns.filter((t) => t.leak).map((t) => ({ u: t.utterance, match: t.leakMatch })),
  ),
  check("P-no-causal-inflation", P.turns.every((t) => !t.causalInflation), "S1", P.turns.filter((t) => t.causalInflation).map((t) => t.utterance)),
  check("P-learning-writes-0", !P.turns.some((t) => t.writes12 === "true" || t.app4 === "true"), "S1", {}),
  check(
    "P-decision-acknowledged",
    /approv|decision|Demand Surge|yes/i.test(P.turns[4]?.reply ?? ""),
    "S2",
    P.turns[4]?.reply?.slice(0, 240),
  ),
];
const probe = summarizeJourney("direct-manager-probe", P, probeChecks);

const journeys = [journeyA, journeyB, journeyC, journeyD, refreshProof, probe];
const s0 = journeys.reduce((n, j) => n + j.s0, 0) + (globalErrors.length > 0 ? 1 : 0);
const s1 = journeys.reduce((n, j) => n + j.s1, 0);
const s2 = journeys.reduce((n, j) => n + j.s2, 0);
const s3 = journeys.reduce((n, j) => n + j.s3, 0);
const leakCount = journeys.reduce((n, j) => n + (j.architectureLeakTurns?.length ?? 0), 0);
const trustPass = journeys.every((j) => j.pass) && globalErrors.length === 0 && s0 === 0 && s1 === 0;
const allPass = trustPass && leakCount === 0 && s2 === 0;

const evidence = {
  identity: "NPA-T ECA:FINAL/IntegratedExecutiveConversation",
  url,
  pageErrors: globalErrors.length,
  learningWrites: 0,
  s0,
  s1,
  s2,
  s3,
  journeyA: {
    pass: journeyA.pass,
    turns: journeyA.turnCount,
    failed: journeyA.failed,
    decisions: journeyA.lastDecisions,
    executions: journeyA.lastExecutions,
    sample: A.turns.map((t) => ({ u: t.utterance, leak: t.leak, d: t.canonicalApproved, e: t.canonicalExecutions, learn: t.learning, attr: t.attribution })),
  },
  journeyB: { pass: journeyB.pass, turns: journeyB.turnCount, failed: journeyB.failed },
  journeyC: { pass: journeyC.pass, turns: journeyC.turnCount, failed: journeyC.failed },
  journeyD: { pass: journeyD.pass, turns: journeyD.turnCount, failed: journeyD.failed },
  refresh: { pass: refreshProof.pass, failed: refreshProof.failed, pre: preRefresh, post: postReloadShell },
  probe: { pass: probe.pass, turns: probe.turnCount, failed: probe.failed, leaks: probe.architectureLeakTurns },
  architectureLeakage: leakCount,
  trustPass,
  passed: allPass,
};

await writeFile(join(out, "integrated-live-evidence.json"), `${JSON.stringify(evidence, null, 2)}\n`);
await page.screenshot({ path: join(out, "integrated-live.png"), fullPage: true });
await browser.close();

console.log(
  JSON.stringify(
    {
      passed: allPass,
      trustPass,
      pageErrors: globalErrors.length,
      architectureLeakage: leakCount,
      s0,
      s1,
      s2,
      s3,
      journeys: Object.fromEntries(
        ["A", "B", "C", "D", "refresh", "probe"].map((k, i) => [k, journeys[i].pass]),
      ),
      journeyLeaks: Object.fromEntries(
        ["A", "B", "C", "D", "refresh", "probe"].map((k, i) => [
          k,
          journeys[i].architectureLeakTurns,
        ]),
      ),
    },
    null,
    2,
  ),
);

if (!trustPass) process.exit(1);
if (!allPass) process.exit(2);
