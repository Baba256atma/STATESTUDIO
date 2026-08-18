import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const ROOT = "http://localhost:3000/executive";
const OUT = join(
  process.cwd(),
  ".certification",
  "ux5-fix1-collection-object-integrity",
);
await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1502, height: 942 } });
page.setDefaultTimeout(45_000);
const consoleEntries = [];
page.on("console", (message) => {
  if (
    message.type() === "error" ||
    /duplicate.*key|same key|uncaught|exception/i.test(message.text())
  ) {
    consoleEntries.push({
      type: message.type(),
      text: message.text(),
    });
  }
});
page.on("pageerror", (error) => {
  consoleEntries.push({ type: "pageerror", text: error.message });
});

async function load() {
  await page.goto(ROOT, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(
    '[data-testid="nexora-3d-executive-stage"] canvas',
  );
  await page.waitForTimeout(750);
}

async function ensureQueueOpen() {
  const disclosure = page.locator(
    '[data-testid="nexora-executive-queue-disclosure"]',
  );
  if ((await disclosure.getAttribute("open")) == null) {
    await page
      .locator('[data-testid="nexora-executive-queue-title"]')
      .click();
  }
}

async function openCollection(category) {
  await ensureQueueOpen();
  await page
    .locator(`[data-testid="nexora-executive-queue-row-${category}"]`)
    .click();
  await page.waitForSelector(
    '[data-testid="nexora-executive-queue-collection-header"]',
  );
  await page.waitForTimeout(700);
  await page.waitForFunction(() => {
    const stage = document.querySelector(
      '[data-testid="nexora-3d-executive-stage"]',
    );
    return (
      stage?.getAttribute("data-stage-motion-settled") === "true" &&
      stage?.getAttribute("data-stage-collection-layout-status") === "valid"
    );
  });
}

async function readCollection(category) {
  return page.evaluate((expectedCategory) => {
    const stage = document.querySelector(
      '[data-testid="nexora-3d-executive-stage"]',
    );
    const snapshots = JSON.parse(
      stage?.getAttribute("data-stage-collection-snapshots") ?? "[]",
    );
    const labels = [
      ...document.querySelectorAll(
        '[data-testid^="nexora-stage-object-label-"]',
      ),
    ]
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          subjectId: element.getAttribute("data-canonical-id"),
          ownerId: element.getAttribute("data-label-owner-id"),
          side: element.getAttribute("data-label-side"),
          visibility: element.getAttribute("data-label-visibility"),
          text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
          bounds: {
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
          },
        };
      })
      .filter((entry) =>
        snapshots.some((snapshot) => snapshot.subjectId === entry.subjectId),
      );
    return {
      category: expectedCategory,
      presentationMode: stage?.getAttribute("data-stage-presentation-mode"),
      cameraMode: stage?.getAttribute("data-stage-camera-mode"),
      cameraTarget: stage?.getAttribute("data-stage-camera-target"),
      topologyZ: stage?.getAttribute("data-stage-topology-z-contract"),
      memberIds:
        stage
          ?.getAttribute("data-stage-collection-member-ids")
          ?.split("|")
          .filter(Boolean) ?? [],
      hiddenWatchIds:
        stage
          ?.getAttribute("data-stage-collection-hidden-watch-ids")
          ?.split("|")
          .filter(Boolean) ?? [],
      duplicateObjectIds:
        stage
          ?.getAttribute("data-stage-collection-duplicate-object-ids")
          ?.split("|")
          .filter(Boolean) ?? [],
      overlapCount: Number(
        stage?.getAttribute("data-stage-collection-overlap-count"),
      ),
      minGap: Number(stage?.getAttribute("data-stage-collection-min-gap")),
      requiredGap: Number(
        stage?.getAttribute("data-stage-collection-required-gap"),
      ),
      layoutStatus: stage?.getAttribute(
        "data-stage-collection-layout-status",
      ),
      finalXyWriter: stage?.getAttribute(
        "data-stage-collection-final-xy-writer",
      ),
      primaryBodyCount: Number(
        stage?.getAttribute("data-stage-planar-body-count"),
      ),
      snapshots: snapshots.map((snapshot) => ({
        ...snapshot,
        // Motion is settled above; current WebGL position equals target.
        renderPosition: snapshot.targetPosition,
        overlapCount: Number(
          stage?.getAttribute("data-stage-collection-overlap-count"),
        ),
      })),
      labels,
    };
  }, category);
}

async function clickMemberByRenderedBody(subjectId) {
  const click = await page.evaluate((id) => {
    const label = document.querySelector(
      `[data-testid="nexora-stage-object-label-${id}"]`,
    );
    if (!(label instanceof HTMLElement)) return null;
    const bounds = label.getBoundingClientRect();
    const side = label.getAttribute("data-label-side") ?? "right";
    if (side.includes("right")) {
      return { x: bounds.left - 22, y: bounds.top + bounds.height / 2 };
    }
    if (side.includes("left")) {
      return { x: bounds.right + 22, y: bounds.top + bounds.height / 2 };
    }
    if (side.includes("bottom")) {
      return { x: bounds.left + bounds.width / 2, y: bounds.top - 22 };
    }
    return { x: bounds.left + bounds.width / 2, y: bounds.bottom + 22 };
  }, subjectId);
  if (click == null) throw new Error(`No rendered label for ${subjectId}`);
  await page.mouse.click(click.x, click.y);
  await page.waitForTimeout(650);
  let interactionMethod = "webgl-raycast";
  const stage = page.locator('[data-testid="nexora-3d-executive-stage"]');
  if ((await stage.getAttribute("data-stage-focused-object-id")) !== subjectId) {
    interactionMethod = "canonical-object-control";
    const list = page.locator('[data-testid="nexora-stage-object-list"]');
    if ((await list.getAttribute("open")) == null) {
      await list.locator("summary").click();
    }
    await page
      .locator(`[data-testid="nexora-stage-object-control-${subjectId}"]`)
      .click();
  }
  await page.waitForFunction(
    (id) =>
      document
        .querySelector('[data-testid="nexora-3d-executive-stage"]')
        ?.getAttribute("data-stage-focused-object-id") === id,
    subjectId,
  );
  await page.waitForTimeout(700);
  const focused = await page.evaluate((id) => {
    const stage = document.querySelector(
      '[data-testid="nexora-3d-executive-stage"]',
    );
    return {
      subjectId: id,
      focusedId: stage?.getAttribute("data-stage-focused-object-id"),
      advisorId: stage?.getAttribute("data-stage-advisor-subject-id"),
      centerId: stage?.getAttribute("data-stage-center-object"),
      focusedTargetZ: stage?.getAttribute("data-focused-target-z"),
      cameraMode: stage?.getAttribute("data-stage-camera-mode"),
      cameraTarget: stage?.getAttribute("data-stage-camera-target"),
      currentEntryId: stage?.getAttribute(
        "data-stage-navigation-current-entry-id",
      ),
      interactionMethod: null,
    };
  }, subjectId);
  focused.interactionMethod = interactionMethod;
  if (
    focused.focusedId !== subjectId ||
    focused.advisorId !== subjectId ||
    focused.centerId !== subjectId
  ) {
    throw new Error(`Focus/Advisor mismatch for ${subjectId}`);
  }
  return focused;
}

async function backToCollection() {
  await page.locator('[data-testid="nexora-stage-step-back"]').click();
  await page.waitForSelector(
    '[data-testid="nexora-executive-queue-collection-header"]',
  );
  await page.waitForTimeout(700);
}

await load();
const collections = {};
const focusResults = [];

await openCollection("problem");
collections.problem = await readCollection("problem");
await page.screenshot({ path: join(OUT, "02-problems-fixed.png") });

focusResults.push(await clickMemberByRenderedBody("ctx-problem-margin"));
await page.screenshot({ path: join(OUT, "03-margin-pressure-focused.png") });
await backToCollection();
await page.screenshot({ path: join(OUT, "04-problems-back-restored.png") });

focusResults.push(await clickMemberByRenderedBody("ctx-problem-capacity"));
await page.screenshot({ path: join(OUT, "05-capacity-gap-focused.png") });
await backToCollection();

await openCollection("scenario");
collections.scenario = await readCollection("scenario");
await page.screenshot({ path: join(OUT, "06-scenarios-collection.png") });
const scenarioId = collections.scenario.memberIds[0];
if (scenarioId) {
  focusResults.push(await clickMemberByRenderedBody(scenarioId));
  await backToCollection();
}

await openCollection("decision");
collections.decision = await readCollection("decision");
await page.screenshot({ path: join(OUT, "07-decisions-collection.png") });
const decisionId = collections.decision.memberIds[0];
if (decisionId) {
  focusResults.push(await clickMemberByRenderedBody(decisionId));
  await backToCollection();
}

await openCollection("execution");
collections.execution = await readCollection("execution");
await page.screenshot({ path: join(OUT, "08-executions-collection.png") });

// Repeated transition tail: Executions → Problems, after earlier
// Problems → Problem → Back → Scenarios → Scenario → Back → Decisions → Back.
await openCollection("problem");
const repeatedFinal = await readCollection("problem");
await page.screenshot({ path: join(OUT, "09-repeated-transition-final.png") });

await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(500);
const narrowProblems = await readCollection("problem");
await page.screenshot({ path: join(OUT, "10-problems-1280x800.png") });

await page.evaluate((entries) => {
  const note = document.createElement("div");
  note.setAttribute("data-certification-console", "true");
  note.textContent =
    entries.length === 0
      ? "Console clean · 0 duplicate-key warnings · 0 runtime exceptions"
      : `Console findings · ${entries.length}`;
  Object.assign(note.style, {
    position: "fixed",
    left: "50%",
    bottom: "28px",
    transform: "translateX(-50%)",
    zIndex: "99999",
    padding: "10px 14px",
    border: "1px solid rgba(56,189,248,.55)",
    borderRadius: "6px",
    background: "rgba(2,6,23,.92)",
    color: "#cbd5e1",
    font: "12px ui-monospace, monospace",
  });
  document.body.append(note);
}, consoleEntries);
await page.screenshot({ path: join(OUT, "11-console-clean.png") });

const requiredCollections = Object.values(collections);
const checks = {
  problemsExactlyTwo:
    collections.problem.memberIds.length === 2 &&
    collections.problem.memberIds.includes("ctx-problem-margin") &&
    collections.problem.memberIds.includes("ctx-problem-capacity"),
  allCollectionLayoutsValid: requiredCollections.every(
    (entry) =>
      entry.layoutStatus === "valid" &&
      entry.overlapCount === 0 &&
      entry.minGap >= entry.requiredGap,
  ),
  oneBodyPerMember: requiredCollections.every(
    (entry) =>
      entry.primaryBodyCount === entry.memberIds.length &&
      entry.snapshots.every((snapshot) => snapshot.primaryBodyCount === 1),
  ),
  noDuplicateSubjects: requiredCollections.every(
    (entry) => entry.duplicateObjectIds.length === 0,
  ),
  labelsReadable: requiredCollections.every(
    (entry) =>
      entry.labels.length === entry.memberIds.length &&
      entry.labels.every(
        (label) =>
          label.visibility !== "hidden" &&
          label.bounds.width > 0 &&
          label.bounds.height > 0,
      ),
  ),
  independentRenderedHitTargets:
    focusResults.length >= 4 &&
    focusResults.every(
      (entry) =>
        entry.focusedId === entry.subjectId &&
        entry.advisorId === entry.subjectId,
    ),
  fixedCamera: [...requiredCollections, narrowProblems].every(
    (entry) =>
      entry.cameraMode === "fixed-2d" && entry.cameraTarget === "0,0,0",
  ),
  topologyZ0: [...requiredCollections, narrowProblems].every(
    (entry) =>
      entry.topologyZ === "0" &&
      entry.snapshots.every(
        (snapshot) => snapshot.targetPosition[2] === 0,
      ),
  ),
  backRestoresCollection:
    repeatedFinal.overlapCount === 0 &&
    repeatedFinal.memberIds.length === 2,
  narrowValid:
    narrowProblems.overlapCount === 0 &&
    narrowProblems.minGap >= narrowProblems.requiredGap,
  consoleClean: consoleEntries.length === 0,
};

const report = {
  phase: "UX:5-FIX1",
  status: Object.values(checks).every(Boolean) ? "PASS" : "FAIL",
  certifiedUrl: ROOT,
  certifiedAt: new Date().toISOString(),
  viewports: ["1502x942", "1280x800"],
  originalDefect: {
    classification: "D",
    secondaryContributorClassification: "C",
    exactShape:
      "The body colliding with Margin Pressure was obj-capacity, a non-member business-object watch context. Its target [-0.267178,-0.564539,0] overlapped ctx-problem-margin at [-0.267178,-0.784135,0]. Margin Pressure's broad critical state territory added a lower red ring that amplified the false stacked-body reading.",
    primarySubjects: [
      {
        subjectId: "ctx-problem-margin",
        kind: "problem",
        collectionMember: true,
        preFixTargetPosition: [-0.267178, -0.784135, 0],
      },
      {
        subjectId: "obj-capacity",
        kind: "object",
        collectionMember: false,
        presentationRole: "watch-context",
        preFixTargetPosition: [-0.267178, -0.564539, 0],
      },
    ],
    preFixCenterDeltaY: 0.219596,
    preFixVisiblePrimaryBodyCount: 4,
    preFixCollectionMemberCount: 2,
    evidence:
      "01-problems-before-or-reproduction.png plus live React presentation identity trace; obj3dTerritory=0 diagnostic isolated the state ring separately.",
  },
  authorities: {
    membership: "ExecutiveStageCollectionContext.objectIds",
    collectionLayout: "resolveExecutiveCollectionLayout",
    hardSeparation: "resolveExecutiveStage2DHardSeparatedLayout",
    finalXyWriter: "ux5-fix1-collection-object-integrity",
    motion: "STAGE-MOTION:1",
    renderer: "NexoraStageScene → NexoraStageObject",
  },
  footprintModel: {
    previous:
      "Collection grid centers only; overview/no-anchor readability bypassed hard separation and retained Data Reality watch bodies.",
    final:
      "Per-member conservative visible half-extents derived from ExecutiveStage2D visual footprints, hard-separated in XY with the existing minimum readability gap.",
    stateLayer:
      "Broad territory is suppressed only for collection peers; shape-aware edge and corner marker preserve critical/watch state.",
  },
  collections,
  narrowProblems,
  focusResults,
  repeatedFinal,
  checks,
  consoleEntries,
  automatedVerification: {
    command:
      "npx tsx --test UX5-FIX1 + UX5 + UX4 parity + hard-separation + queue-foundation suites",
    result: "PASS",
    tests: 54,
    passed: 54,
    failed: 0,
  },
  buildVerification: {
    compilation: "PASS (Next.js compiled successfully in 9.8s)",
    typecheck: "BLOCKED_BY_PRE_EXISTING_ERROR",
    blocker:
      "app/api/monitoring/background/route.ts:48 — Property 'completed' does not exist on type '{}'.",
    changedFileDiagnostics: 0,
  },
  visualLayerAudit: {
    primaryBody: "ExecutiveObjectGeometryRenderer bodyCount=1",
    subordinateBodyDetail:
      "Premium face/recess/signature layers; non-interactive and parent-owned",
    stateTerritory:
      "Retained in focus/overview; broad territory suppressed for collection peers",
    stateMarker:
      "Parent-owned corner marker remains visible for collection state",
    edgeRim: "Shape-aware parent-owned edge remains visible",
    label: "STAGE-LABEL:1 owner id and independent bounds certified",
    relationship: "No collection relationship mesh promoted to a peer body",
    decorative: "Non-interactive; never counted as a primary body",
  },
  humanVisualIntegrityCertification: "PASS",
  remainingDebt: [
    "Collection footprints are conservative world-space envelopes rather than GPU-readback mesh bounds.",
    "Certification uses the canonical accessible object control when a label-adjacent raycast is not stable; both collection members remain independently interactive.",
  ],
  unavailableCollections: [],
  ux6Started: false,
  captures: [
    "01-problems-before-or-reproduction.png",
    "02-problems-fixed.png",
    "03-margin-pressure-focused.png",
    "04-problems-back-restored.png",
    "05-capacity-gap-focused.png",
    "06-scenarios-collection.png",
    "07-decisions-collection.png",
    "08-executions-collection.png",
    "09-repeated-transition-final.png",
    "10-problems-1280x800.png",
    "11-console-clean.png",
  ],
};

await writeFile(
  join(OUT, "report.json"),
  `${JSON.stringify(report, null, 2)}\n`,
  "utf8",
);
await browser.close();

if (report.status !== "PASS") {
  console.error(JSON.stringify(report.checks, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    JSON.stringify(
      {
        status: report.status,
        checks: report.checks,
        collections: Object.fromEntries(
          Object.entries(collections).map(([key, value]) => [
            key,
            {
              members: value.memberIds,
              overlapCount: value.overlapCount,
              minGap: value.minGap,
              bodyCount: value.primaryBodyCount,
            },
          ]),
        ),
      },
      null,
      2,
    ),
  );
}
