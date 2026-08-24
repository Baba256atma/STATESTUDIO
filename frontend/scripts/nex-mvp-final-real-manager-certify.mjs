/**
 * NEX-MVP-FINAL:1 — live real-manager journey on /executive?entrance=1&reset=1.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), ".certification/nex-mvp-final-real-manager");
const EXISTING = "http://localhost:3000/executive";
const ENTRANCE = "http://localhost:3000/executive?entrance=1&reset=1";
const LEAK =
  /\b(?:NEX-EXP:|NEX-E2E:|MO:\d|CC:\d|EI:\d|APP-4|CORE-OUT|Data Reality|startsExecution|commitsDecision|startsLearning|lastMutatedExecution|READY_FOR_[A-Z_]+)\b/i;

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];

async function createPage(url) {
  const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
  page.setDefaultTimeout(45000);
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const response = await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('[data-testid="nexora-executive-shell"]');
  await page.waitForSelector('[data-testid="nexora-3d-executive-stage"] canvas');
  await page.waitForSelector('[data-ux3="professional-advisor"]');
  await page.waitForTimeout(700);
  return { page, http: response?.status() ?? 0 };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const shell = document.querySelector('[data-testid="nexora-executive-shell"]');
    const stage = document.querySelector('[data-testid="nexora-3d-executive-stage"]');
    const last =
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent ?? "";
    return {
      mode: shell?.getAttribute("data-nex-exp1-mode"),
      objectCount: Number(shell?.getAttribute("data-nex-exp1-object-count") ?? 0),
      focused: shell?.getAttribute("data-focused-subject"),
      final: shell?.getAttribute("data-nex-mvp-final"),
      newEngine: shell?.getAttribute("data-nex-mvp-final-new-engine"),
      committed: shell?.getAttribute("data-nex-exp7-committed"),
      started: shell?.getAttribute("data-nex-exp8-started"),
      camera: stage?.getAttribute("data-stage-camera-mode"),
      topologyZ: stage?.getAttribute("data-stage-topology-z-contract"),
      last,
    };
  });
}

async function ask(page, utterance) {
  const field = page.locator('[data-testid="nexora-conversational-input-field"]');
  await field.fill(utterance);
  await field.press("Enter");
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[data-testid="nexora-conversational-message-nexora"]')]
        .at(-1)?.textContent?.length > 8,
  );
  await page.waitForTimeout(350);
  return snapshot(page);
}

const existing = await createPage(EXISTING);
const existingSnap = await snapshot(existing.page);
await existing.page.screenshot({ path: join(OUT, "00-existing-workspace.png") });
await existing.page.close();

const { page, http } = await createPage(ENTRANCE);
await page.screenshot({ path: join(OUT, "01-entrance.png") });
const replies = [];
const script = [
  "Hi",
  "What can you do for me?",
  "My name is Alex.",
  "I manage a manufacturing company.",
  "We have problems with delivery and capacity.",
  "I want to improve delivery performance.",
  "We're currently at 91%; target is 96%.",
  "Backlog is high.",
  "What may be preventing the Goal?",
  "Capacity is our biggest problem.",
  "Are we ready to explore scenarios?",
  "What are my options?",
  "We could add temporary capacity.",
  "Give me another scenario.",
  "We could use external capacity.",
  "What if we do nothing?",
  "Compare them.",
  "Which option is safer?",
  "What do you recommend?",
  "Why?",
  "Let's do that.",
  "Approve it.",
  "Confirm.",
  "What happens next?",
  "Let's start it.",
  "Confirm.",
  "What changed?",
  "On-time delivery is now 94%.",
  "Did it work?",
  "What did we learn?",
  "What should we do differently next time?",
];

let last = await snapshot(page);
for (const utterance of script) {
  last = await ask(page, utterance);
  replies.push({ utterance, text: last.last });
}
await page.screenshot({ path: join(OUT, "02-journey-complete.png") });
await page.close();
await browser.close();

const leaked = replies.filter((entry) => LEAK.test(entry.text));
const liveReport = {
  phase: "NEX-MVP-FINAL:1",
  identity: "NEX-MVP-FINAL:1/RealManagerMvpCertification",
  completedAt: new Date().toISOString(),
  http,
  existingWorkspaceProtected:
    existingSnap.mode === "existing-workspace" && existingSnap.objectCount > 3,
  firstTime: last.mode === "first-time" || last.mode === "returning-sufficient",
  noNewEngine: last.newEngine === "false",
  capabilityExplained: /situation|decisions you control/i.test(
    replies.find((entry) => entry.utterance === "What can you do for me?")?.text ?? "",
  ),
  managerCommitted: last.committed === "true",
  executionStarted: last.started === "true",
  cameraFixed: last.camera === "fixed-2d",
  topologyPresent: Boolean(last.topologyZ),
  architectureLeakCount: leaked.length,
  leakedTurns: leaked.slice(0, 8),
  errors: [...new Set(errors)].slice(0, 12),
};

await writeFile(join(OUT, "live-browser.json"), JSON.stringify(liveReport, null, 2));
console.log(JSON.stringify(liveReport, null, 2));
process.exit(
  liveReport.http === 200 &&
    liveReport.existingWorkspaceProtected &&
    liveReport.noNewEngine &&
    liveReport.architectureLeakCount === 0 &&
    liveReport.managerCommitted &&
    liveReport.errors.length === 0
    ? 0
    : 1,
);
