/**
 * NPA-T SIM-TEST:6 — observational report writer. Does not repair or restore production state.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type {
  NexoraSimulationJourneyTurnObservation,
  NexoraSimulationTestFinding,
  NexoraSimulationTestRunReport,
} from "./nexoraSimulationTestContract.ts";

const ARTIFACT_DIR = fileURLToPath(new URL("../../../artifacts/sim-test/SIM-TEST-6/", import.meta.url));

export type SimTest6RootCluster = Readonly<{
  signature: string;
  owner: string;
  classification: string;
  firstTurn: number;
  firstJourneyId: string;
  rootCount: number;
  downstreamCount: number;
  affectedTurns: readonly number[];
  findingIds: readonly string[];
}>;

function countTurns(report: NexoraSimulationTestRunReport, intent: string): number {
  return report.journeyObservations.filter((item) => item.intent === intent).length;
}

function checkpointRows(report: NexoraSimulationTestRunReport): readonly NexoraSimulationJourneyTurnObservation[] {
  const rows: NexoraSimulationJourneyTurnObservation[] = [];
  for (const observation of report.journeyObservations) {
    if (observation.turn === 1 || observation.turn % 10 === 0) rows.push(observation);
    else if (observation.intent === "COMMIT_DECISION" || observation.intent === "REQUEST_EXECUTION" || observation.intent === "ASK_OUTCOME") {
      rows.push(observation);
    }
  }
  const last = report.journeyObservations[report.journeyObservations.length - 1];
  if (last && rows[rows.length - 1]?.turn !== last.turn) rows.push(last);
  return rows;
}

function uniqueIds(observations: readonly NexoraSimulationJourneyTurnObservation[], key: "decisionId" | "executionId" | "scenarioId"): readonly string[] {
  return [...new Set(observations.map((item) => item[key]).filter((item): item is string => Boolean(item)))];
}

const PRIMARY_JOURNEY = "sim-test-6-manufacturing-long";

export function uniqueSimTest6Findings(reports: readonly NexoraSimulationTestRunReport[]): readonly NexoraSimulationTestFinding[] {
  const map = new Map<string, NexoraSimulationTestFinding>();
  for (const report of reports) {
    for (const finding of report.findings) map.set(finding.findingId, finding);
    for (const finding of report.journeyFindings) map.set(finding.findingId, finding);
  }
  return Object.freeze([...map.values()]);
}

export function clusterSimTest6Findings(findings: readonly NexoraSimulationTestFinding[]): readonly SimTest6RootCluster[] {
  const groups = new Map<string, NexoraSimulationTestFinding[]>();
  for (const finding of findings) {
    const signature = `${finding.likelyOwner}|${finding.classification}|${finding.severity}`;
    const list = groups.get(signature) ?? [];
    list.push(finding);
    groups.set(signature, list);
  }
  return [...groups.entries()].map(([signature, grouped]) => {
    const sorted = [...grouped].sort((a, b) => {
      const primary = Number(a.journeyId === PRIMARY_JOURNEY) - Number(b.journeyId === PRIMARY_JOURNEY);
      if (primary !== 0) return -primary;
      return a.managerTurn - b.managerTurn || a.journeyId.localeCompare(b.journeyId);
    });
    const first = sorted[0];
    return Object.freeze({
      signature,
      owner: first.likelyOwner,
      classification: first.classification,
      firstTurn: first.managerTurn,
      firstJourneyId: first.journeyId,
      rootCount: 1,
      downstreamCount: Math.max(0, sorted.length - 1),
      affectedTurns: Object.freeze([...new Set(sorted.map((item) => item.managerTurn))]),
      findingIds: Object.freeze(sorted.map((item) => item.findingId)),
    });
  }).sort((a, b) => {
    const primary = Number(a.firstJourneyId === PRIMARY_JOURNEY) - Number(b.firstJourneyId === PRIMARY_JOURNEY);
    if (primary !== 0) return -primary;
    return a.firstTurn - b.firstTurn || a.signature.localeCompare(b.signature);
  });
}

function mdEscape(value: string): string {
  return value.replace(/\r?\n/g, " ").slice(0, 400);
}

function utteranceFor(finding: NexoraSimulationTestFinding, reports: readonly NexoraSimulationTestRunReport[]): string {
  const report = reports.find((item) => item.identity.journeyId === finding.journeyId);
  const row = report?.journeyObservations.find((item) => item.turn === finding.managerTurn);
  return mdEscape(row?.utterance ?? "(utterance not captured)");
}

function findingBlock(
  finding: NexoraSimulationTestFinding,
  role: "ROOT" | "DOWNSTREAM",
  reports: readonly NexoraSimulationTestRunReport[],
): string {
  return [
    `### ${finding.findingId}`,
    `- Finding ID: ${finding.findingId}`,
    `- Severity: ${finding.severity}`,
    `- Scenario: ${finding.scenarioId}`,
    `- Turn: ${finding.managerTurn}`,
    `- Tick: ${finding.tick}`,
    `- Manager utterance: ${utteranceFor(finding, reports)}`,
    `- Expected legitimate behavior: ${mdEscape(finding.expectedInvariant)}`,
    `- Actual behavior: ${mdEscape(finding.observedBehavior)}`,
    `- First divergence: T${finding.managerTurn} ${finding.classification}`,
    `- Earliest owner: ${finding.likelyOwner}`,
    `- Root/downstream: ${role}`,
    `- Reproduction signature: ${finding.classification}@${finding.journeyId}:T${finding.managerTurn}`,
    `- Status: OPEN`,
    "",
  ].join("\n");
}

export function writeSimTest6Artifacts(input: {
  reports: readonly NexoraSimulationTestRunReport[];
  clusters: readonly SimTest6RootCluster[];
  certified: boolean;
  notes: Readonly<Record<string, string>>;
}): void {
  mkdirSync(ARTIFACT_DIR, { recursive: true });
  const manufacturing = input.reports.find((item) => item.identity.journeyId === "sim-test-6-manufacturing-long");
  const project = input.reports.find((item) => item.identity.journeyId === "sim-test-6-project-long");
  const logistics = input.reports.find((item) => item.identity.journeyId === "sim-test-6-logistics-parity");
  const service = input.reports.find((item) => item.identity.journeyId === "sim-test-6-service-parity");
  const fast = input.reports.find((item) => item.identity.journeyId === "sim-test-6-fast-parity");
  const impatient = input.reports.find((item) => item.identity.journeyId === "sim-test-6-manufacturing-impatient");
  const fresh = input.reports.find((item) => item.identity.journeyId === "sim-test-6-fresh-session");
  const allFindings = uniqueSimTest6Findings(input.reports);
  const s1 = allFindings.filter((item) => item.severity === "S1");
  const firstMaterial = input.clusters.find((item) => {
    const finding = allFindings.find((candidate) => candidate.findingId === item.findingIds[0]);
    return finding?.severity === "S0" || finding?.severity === "S1";
  });

  const write = (name: string, body: string) => {
    writeFileSync(`${ARTIFACT_DIR}${name}`, body.trimEnd() + "\n");
  };

  write("CERTIFICATION.md", [
    `# SIM-TEST:6 Certification`,
    ``,
    `Status: ${input.certified ? "CERTIFIED" : "NOT CERTIFIED"}`,
    ``,
    `- S0: ${allFindings.filter((item) => item.severity === "S0").length}`,
    `- S1: ${s1.length}`,
    `- S2: ${allFindings.filter((item) => item.severity === "S2").length}`,
    `- S3: ${allFindings.filter((item) => item.severity === "S3").length}`,
    `- Harness failures: ${input.reports.filter((item) => item.harnessStatus === "FAIL").length}`,
    `- Root clusters: ${input.clusters.length}`,
    `- First material failure: ${firstMaterial ? `${firstMaterial.classification} T${firstMaterial.firstTurn} (${firstMaterial.firstJourneyId})` : "none"}`,
    `- Earliest owner: ${firstMaterial?.owner ?? "none"}`,
    `- Production files changed: none (discovery)`,
    `- Repair inside discovery: none`,
  ].join("\n"));

  const runSection = (title: string, report: NexoraSimulationTestRunReport | undefined) => {
    if (!report) return [`## ${title}`, "Not run.", ""];
    const obs = report.journeyObservations;
    return [
      `## ${title}`,
      `- Journey: ${report.identity.journeyId}`,
      `- Turns: ${report.turns}`,
      `- Ticks: ${report.ticks}`,
      `- Mode: ${report.identity.mode}`,
      `- Profile: ${report.identity.managerProfileId}`,
      `- Signature: ${report.deterministicSignature}`,
      `- Stop: ${report.stopReason}`,
      `- Harness: ${report.harnessStatus}`,
      `- Product: ${report.productStatus}`,
      `- Continuity conversation: ${report.continuity.conversationContinuity}`,
      `- Continuity referent: ${report.continuity.referentContinuity}`,
      `- Continuity NMI: ${report.continuity.nmiIdentityContinuity}`,
      `- Continuity MLEVEL: ${report.continuity.mlevelContinuity}`,
      `- Continuity Stage: ${report.continuity.stageContinuity}`,
      `- Continuity Advisor: ${report.continuity.advisorContinuity}`,
      `- Data freshness: ${report.continuity.dataFreshness}`,
      `- Evidence safety: ${report.continuity.evidenceSafety}`,
      `- Causal safety: ${report.continuity.causalSafety}`,
      `- Decision IDs: ${uniqueIds(obs, "decisionId").join(", ") || "none"}`,
      `- Execution IDs: ${uniqueIds(obs, "executionId").join(", ") || "none"}`,
      `- Scenario IDs: ${uniqueIds(obs, "scenarioId").join(", ") || "none"}`,
      `- Subject switches: ${countTurns(report, "CHANGE_CONTEXT")}`,
      `- Historical returns: ${countTurns(report, "RETURN_TO_SUBJECT")}`,
      `- Clarification-required turns: ${obs.filter((item) => item.clarificationRequired).length}`,
      `- Learning durable: ${obs.some((item) => item.npsLearningDurable === true)}`,
      `- Journey findings: ${report.journeyFindings.length}`,
      `- Harness findings: ${report.findings.length}`,
      "",
    ];
  };

  write("MANUFACTURING-LONG-RUN.md", runSection("Manufacturing long session", manufacturing).join("\n"));
  write("PROJECT-LONG-RUN.md", runSection("Project long session", project).join("\n"));
  write("PARITY-RUNS.md", [
    ...runSection("Logistics", logistics),
    ...runSection("Service", service),
    ...runSection("FAST", fast),
    ...runSection("Impatient manufacturing", impatient),
  ].join("\n"));

  const checkpointLines = ["# SIM-TEST:6 Checkpoints", ""];
  for (const report of input.reports) {
    checkpointLines.push(`## ${report.identity.journeyId}`, "");
    checkpointLines.push("| turn | tick | subject | referent | clarification | NMI | MLEVEL L1 | Stage | Advisor | DR pubs | decision | execution | outcome | findings |");
    checkpointLines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
    for (const row of checkpointRows(report)) {
      const findingCount = [...report.findings, ...report.journeyFindings].filter((item) => item.managerTurn === row.turn).length;
      checkpointLines.push(`| ${row.turn} | ${row.tick} | ${row.canonicalSubjectId ?? ""} | ${row.focusedSubjectLabel ?? ""} | ${row.clarificationRequired} | ${row.nmiCanonicalId ?? ""} | ${row.mlevelL1 ?? ""} | ${row.stageActiveSubjectId ?? ""} | ${row.advisorReferentName ?? row.advisorReferentId ?? ""} | ${row.dataPublicationIds.length} | ${row.decisionId ?? row.decisionStatus ?? ""} | ${row.executionId ?? row.executionStatus ?? ""} | ${row.npsOutcomeStatus ?? ""} | ${findingCount} |`);
    }
    checkpointLines.push("");
  }
  write("CHECKPOINTS.md", checkpointLines.join("\n"));

  const findingLines = ["# SIM-TEST:6 Findings", ""];
  const seen = new Set<string>();
  for (const cluster of input.clusters) {
    for (const [index, id] of cluster.findingIds.entries()) {
      const finding = allFindings.find((item) => item.findingId === id);
      if (!finding || seen.has(finding.findingId)) continue;
      seen.add(finding.findingId);
      findingLines.push(findingBlock(finding, index === 0 ? "ROOT" : "DOWNSTREAM", input.reports));
    }
  }
  if (allFindings.length === 0) findingLines.push("No Observer or harness findings recorded.");
  write("FINDINGS.md", findingLines.join("\n"));

  write("ROOT-CLUSTERS.md", [
    "# SIM-TEST:6 Root Clusters",
    "",
    ...input.clusters.flatMap((cluster, index) => [
      `## Root Cluster ${String.fromCharCode(65 + (index % 26))}${index >= 26 ? String(index) : ""}`,
      `- Root signature: ${cluster.signature}`,
      `- First failure: T${cluster.firstTurn} (${cluster.firstJourneyId})`,
      `- Owner: ${cluster.owner}`,
      `- Classification: ${cluster.classification}`,
      `- Root findings: ${cluster.rootCount}`,
      `- Downstream symptoms: ${cluster.downstreamCount}`,
      `- Affected turns: ${cluster.affectedTurns.join(", ")}`,
      "",
    ]),
    input.clusters.length === 0 ? "No clusters. No recorded findings." : "",
  ].join("\n"));

  write("FOCUSED-REPRODUCTIONS.md", [
    "# SIM-TEST:6 Focused Reproductions",
    "",
    "Discovery-only windows. No production repair was attempted from the long-session trace.",
    "",
    ...input.clusters.map((cluster) => {
      const start = Math.max(1, cluster.firstTurn - 8);
      const end = cluster.firstTurn + 2;
      return [
        `## ${cluster.signature}`,
        `- Long-session signature: ${cluster.signature}@${cluster.firstJourneyId}:T${cluster.firstTurn}`,
        `- Focused window: T${start}–T${end} of ${cluster.firstJourneyId}`,
        `- Preserve prior lifecycle: Decision/Execution/clarification state present before T${cluster.firstTurn}`,
        `- Status: DESCRIBED, not executed as a separate harness journey in this phase`,
        "",
      ].join("\n");
    }),
    input.clusters.length === 0 ? "None required." : "",
  ].join("\n"));

  const identityLines = ["# SIM-TEST:6 Identity Continuity", ""];
  for (const report of [manufacturing, project]) {
    if (!report) continue;
    identityLines.push(`## ${report.identity.journeyId}`);
    identityLines.push(`- Subjects observed: ${[...new Set(report.journeyObservations.map((item) => item.canonicalSubjectId).filter(Boolean))].join(", ") || "none"}`);
    identityLines.push(`- Scenarios: ${uniqueIds(report.journeyObservations, "scenarioId").join(", ") || "none"}`);
    identityLines.push(`- Decisions: ${uniqueIds(report.journeyObservations, "decisionId").join(", ") || "none"}`);
    identityLines.push(`- Executions: ${uniqueIds(report.journeyObservations, "executionId").join(", ") || "none"}`);
    identityLines.push(`- Decision counts over session: ${[...new Set(report.journeyObservations.map((item) => item.decisionCount))].join(" → ")}`);
    identityLines.push(`- Execution counts over session: ${[...new Set(report.journeyObservations.map((item) => item.executionCount))].join(" → ")}`);
    identityLines.push("");
  }
  write("IDENTITY-CONTINUITY.md", identityLines.join("\n"));

  const freshnessLines = ["# SIM-TEST:6 Data Freshness", ""];
  for (const report of input.reports) {
    freshnessLines.push(`## ${report.identity.journeyId}`);
    for (const row of report.freshness) {
      freshnessLines.push(`- T${row.turn} tick ${row.tick} ingestionTick=${row.latestIngestionTick} csv=${row.csvVersions.map((item) => `${item.sourceType}:v${item.version}`).join(",") || "none"} refs=${row.dataRealityRefs.join(",") || "none"}`);
    }
    freshnessLines.push("");
  }
  write("DATA-FRESHNESS.md", freshnessLines.join("\n"));

  const sampleClaims = (report: NexoraSimulationTestRunReport | undefined) => {
    if (!report || report.journeyObservations.length === 0) return ["Not run."];
    const obs = report.journeyObservations;
    const picks = [obs[0], obs[Math.floor(obs.length / 2)], obs[obs.length - 1]].filter(Boolean);
    return picks.map((row) => {
      const marks = row.epistemicMarks.join(", ") || "none";
      const kind = /unknown|too early|not enough/i.test(row.response) ? "UNKNOWN"
        : /associat|may|possible|estimat/i.test(row.response) ? "QUALIFIED"
        : "SUPPORTED";
      return `- T${row.turn} tick ${row.tick} test-only class ${kind}; epistemicMarks=${marks}; excerpt=${mdEscape(row.response)}`;
    });
  };
  write("EVIDENCE-CAUSAL-SAFETY.md", [
    "# SIM-TEST:6 Evidence and Causal Safety",
    "",
    "Test-only sampling. Not a production classifier.",
    "",
    "## Manufacturing early/mid/late",
    ...sampleClaims(manufacturing),
    "",
    "## Project early/mid/late",
    ...sampleClaims(project),
    "",
    `- Continuity evidence (manufacturing): ${manufacturing?.continuity.evidenceSafety ?? "n/a"}`,
    `- Continuity causal (manufacturing): ${manufacturing?.continuity.causalSafety ?? "n/a"}`,
  ].join("\n"));

  write("LIFECYCLE-CONTINUITY.md", [
    "# SIM-TEST:6 Lifecycle Continuity",
    "",
    manufacturing ? [
      "## Manufacturing",
      `- Problem labels: ${[...new Set(manufacturing.journeyObservations.map((item) => item.npsProblemLabel).filter(Boolean))].join(" | ") || "none"}`,
      `- Decision IDs: ${uniqueIds(manufacturing.journeyObservations, "decisionId").join(" | ") || "none"}`,
      `- Execution IDs: ${uniqueIds(manufacturing.journeyObservations, "executionId").join(" | ") || "none"}`,
      `- Outcome statuses: ${[...new Set(manufacturing.journeyObservations.map((item) => item.npsOutcomeStatus).filter(Boolean))].join(" | ") || "none"}`,
      `- Learning durable any: ${manufacturing.journeyObservations.some((item) => item.npsLearningDurable === true)}`,
    ].join("\n") : "Manufacturing not run.",
    "",
    project ? [
      "## Project",
      `- Decision IDs: ${uniqueIds(project.journeyObservations, "decisionId").join(" | ") || "none"}`,
      `- Execution IDs: ${uniqueIds(project.journeyObservations, "executionId").join(" | ") || "none"}`,
      `- Outcome statuses: ${[...new Set(project.journeyObservations.map((item) => item.npsOutcomeStatus).filter(Boolean))].join(" | ") || "none"}`,
    ].join("\n") : "",
  ].join("\n"));

  const priorDecision = manufacturing?.journeyObservations.map((item) => item.decisionId).find(Boolean) ?? null;
  const freshDecision = fresh?.journeyObservations.map((item) => item.decisionId).find(Boolean) ?? null;
  write("CROSS-RUN-ISOLATION.md", [
    "# SIM-TEST:6 Cross-run Isolation",
    "",
    `- Fresh session journey: ${fresh?.identity.journeyId ?? "missing"}`,
    `- Fresh runId: ${fresh?.identity.rmsRunId ?? "missing"}`,
    `- Manufacturing runId: ${manufacturing?.identity.rmsRunId ?? "missing"}`,
    `- Fresh turns: ${fresh?.turns ?? 0}`,
    `- Fresh decision IDs: ${fresh ? uniqueIds(fresh.journeyObservations, "decisionId").join(", ") || "none" : "n/a"}`,
    `- Manufacturing decision IDs: ${manufacturing ? uniqueIds(manufacturing.journeyObservations, "decisionId").join(", ") || "none" : "n/a"}`,
    `- Prior manufacturing decision leaked into fresh: ${priorDecision && freshDecision && priorDecision === freshDecision ? "YES" : "NO"}`,
    `- Fresh clarification-required: ${fresh?.journeyObservations.some((item) => item.clarificationRequired) ?? "n/a"}`,
    `- Isolation note: ${input.notes.isolation ?? ""}`,
  ].join("\n"));

  write("PERFORMANCE-OBSERVATIONS.md", [
    "# SIM-TEST:6 Performance Observations",
    "",
    "No microbenchmark thresholds. Coarse harness duration only.",
    "",
    `- Notes: ${input.notes.performance ?? "see test stdout"}`,
    `- Manufacturing turns: ${manufacturing?.turns ?? 0}`,
    `- Project turns: ${project?.turns ?? 0}`,
    `- Total Manager turns: ${input.reports.reduce((sum, item) => sum + item.turns, 0)}`,
  ].join("\n"));

  write("BROWSER-RUNTIME-EVIDENCE.md", [
    "# SIM-TEST:6 Browser Runtime",
    "",
    input.notes.browser ?? "Not executed in this discovery pass.",
  ].join("\n"));
}

export function simTest6ArtifactDir(): string {
  return ARTIFACT_DIR;
}
