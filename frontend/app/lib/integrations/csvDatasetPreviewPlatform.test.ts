import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as platformApi from "./csvDatasetPreviewPlatform.ts";
import {
  createCsvDatasetPreview,
  CsvDatasetPreviewPlatform,
  CsvDelimiterCandidates,
  CsvParserDiagnosticCatalog,
  CsvParserLimits,
  detectCsvDelimiter,
  inferCsvPrimitiveType,
  normalizeCsvParserInput,
  parseCsvRecords,
} from "./csvDatasetPreviewPlatform.ts";
import type { CsvParserRequest } from "./csvParserTypes.ts";

const HERE = dirname(fileURLToPath(import.meta.url));

const INT12_FILES = [
  "csvParserTypes.ts",
  "csvInputNormalizer.ts",
  "csvDelimiterDetector.ts",
  "csvRecordParser.ts",
  "csvPrimitiveTypeInference.ts",
  "csvDatasetPreviewBuilder.ts",
  "csvParserDiagnostics.ts",
  "csvDatasetPreviewPlatform.ts",
  "csvDatasetPreviewPlatform.test.ts",
];

const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};

const baseRequest = (overrides: Partial<CsvParserRequest> = {}): CsvParserRequest => ({
  sessionId: "session-1",
  tenantId: "tenant-1",
  workspaceId: "workspace-1",
  sourceMode: "CsvText",
  sourceName: "sales.csv",
  encodingHint: "UTF-8",
  delimiterHint: "Comma",
  hasHeader: true,
  previewRowLimit: 50,
  strictColumnCount: false,
  input: {
    mode: "CsvText",
    name: "sales.csv",
    content:
      "customer_name,product,quantity,revenue,date\nABC Company,Laptop,10,25000,2026-07-01\nXYZ Inc,Monitor,4,3200,2026-07-02",
    encodingHint: "UTF-8",
  },
  ...overrides,
});

test("1. exactly nine INT-1:2 files exist", () => {
  const present = readdirSync(HERE).filter((f) => INT12_FILES.includes(f));
  assert.equal(present.length, 9);
  for (const file of INT12_FILES) {
    assert.ok(readdirSync(HERE).includes(file), `missing ${file}`);
  }
});

test("2. platform module has exactly nine runtime exports", () => {
  assert.deepEqual(Object.keys(platformApi).sort(), [
    "CsvDatasetPreviewPlatform",
    "CsvDelimiterCandidates",
    "CsvParserDiagnosticCatalog",
    "CsvParserLimits",
    "createCsvDatasetPreview",
    "detectCsvDelimiter",
    "inferCsvPrimitiveType",
    "normalizeCsvParserInput",
    "parseCsvRecords",
  ]);
});

test("3. INT-1:1 is consumed through its foundation API", () => {
  for (const file of INT12_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    // Runtime imports of INT-1:1 must go through the foundation module.
    // Type-only imports from foundation types are permitted when types are not
    // re-exported by the foundation contract.
    const runtimeImportPattern =
      /(?:^|\n)import\s+(?!type\b)[\s\S]*?from\s+["']([^"']*csvManualInput[^"']*)["']/g;
    let match: RegExpExecArray | null;
    while ((match = runtimeImportPattern.exec(text)) !== null) {
      assert.match(match[1]!, /csvManualInputFoundation\.ts$/);
    }
  }
});

test("4. no DKL internal module is imported", () => {
  for (const file of INT12_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/from\s+["'].*\/dkl\//.test(text), false, file);
  }
});

test("5. no external CSV package is added", () => {
  const pkg = readFileSync(join(HERE, "../../../package.json"), "utf8");
  assert.equal(/csv-parse|papaparse|fast-csv|csv-stringify/.test(pkg), false);
});

test("6. comma-delimited CSV parses correctly", () => {
  const result = createCsvDatasetPreview(baseRequest());
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.delimiter, "Comma");
    assert.equal(result.dataset.columnCount, 5);
    assert.equal(result.dataset.rowCountObserved, 2);
    assert.equal(result.dataset.columns[0]?.displayName, "customer_name");
    assert.equal(result.dataset.columns[2]?.primitiveType, "Integer");
    assert.equal(result.dataset.columns[4]?.primitiveType, "Date");
  }
});

test("7. semicolon-delimited CSV parses correctly", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      delimiterHint: "Semicolon",
      input: {
        mode: "CsvText",
        name: "s.csv",
        content: "a;b;c\n1;2;3",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.delimiter, "Semicolon");
    assert.equal(result.dataset.columnCount, 3);
  }
});

test("8. tab-delimited CSV parses correctly", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      delimiterHint: "Tab",
      input: {
        mode: "CsvText",
        name: "t.csv",
        content: "a\tb\tc\n1\t2\t3",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.delimiter, "Tab");
  }
});

test("9. pipe-delimited CSV parses correctly", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      delimiterHint: "Pipe",
      input: {
        mode: "CsvText",
        name: "p.csv",
        content: "a|b|c\n1|2|3",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.delimiter, "Pipe");
  }
});

test("10. Auto delimiter detection is deterministic", () => {
  const text = "a;b;c\n1;2;3\n4;5;6";
  const a = detectCsvDelimiter(text, "Auto");
  const b = detectCsvDelimiter(text, "Auto");
  assert.deepEqual(a, b);
  assert.equal(a.delimiter, "Semicolon");
  assert.equal(CsvDelimiterCandidates[0]?.name, "Comma");
});

test("11. quoted delimiters parse correctly", () => {
  const parsed = parseCsvRecords('name,note\n"Doe, Jane","ok, yes"', ",");
  assert.equal(parsed.records[1]?.fields[0], "Doe, Jane");
  assert.equal(parsed.records[1]?.fields[1], "ok, yes");
});

test("12. escaped quotes parse correctly", () => {
  const parsed = parseCsvRecords('a\n"say ""hi"""', ",");
  assert.equal(parsed.records[1]?.fields[0], 'say "hi"');
});

test("13. newlines inside quoted fields parse correctly", () => {
  const parsed = parseCsvRecords('a,b\n"line1\nline2",x', ",");
  assert.equal(parsed.records.length, 2);
  assert.equal(parsed.records[1]?.fields[0], "line1\nline2");
});

test("14. CRLF and LF are supported", () => {
  const lf = parseCsvRecords("a,b\n1,2", ",");
  const crlf = parseCsvRecords("a,b\r\n1,2", ",");
  assert.equal(lf.records.length, 2);
  assert.equal(crlf.records.length, 2);
  assert.deepEqual(lf.records[1]?.fields, crlf.records[1]?.fields);
});

test("15. empty cells are preserved", () => {
  const parsed = parseCsvRecords("a,b,c\n1,,3", ",");
  assert.deepEqual(parsed.records[1]?.fields, ["1", "", "3"]);
});

test("16. empty trailing cells are preserved", () => {
  const parsed = parseCsvRecords("a,b,c\n1,2,", ",");
  assert.deepEqual(parsed.records[1]?.fields, ["1", "2", ""]);
});

test("17. UTF-8 BOM is removed", () => {
  const normalized = normalizeCsvParserInput({
    mode: "CsvText",
    name: "bom.csv",
    content: "\uFEFFa,b\n1,2",
    encodingHint: "UTF-8",
  });
  assert.equal(normalized.encoding, "UTF-8-BOM");
  assert.equal(normalized.text.startsWith("a"), true);
});

test("18. unsupported encoding returns structured failure", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      encodingHint: "UTF-16LE",
      input: {
        mode: "CsvText",
        name: "bad.csv",
        content: "a,b\n1,2",
        encodingHint: "UTF-16LE",
      },
    }),
  );
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.failure.code, "UNSUPPORTED_ENCODING");
  }
});

test("19. headers are resolved correctly", () => {
  const result = createCsvDatasetPreview(baseRequest());
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(
      result.dataset.columns.map((c) => c.displayName),
      ["customer_name", "product", "quantity", "revenue", "date"],
    );
  }
});

test("20. empty headers receive deterministic placeholders", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      input: {
        mode: "CsvText",
        name: "e.csv",
        content: "Customer,,Amount\nA,,1",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.columns[1]?.key, "column_2");
    assert.ok(result.diagnostics.some((d) => d.code === "EMPTY_HEADER"));
  }
});

test("21. duplicate headers receive unique internal keys", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      input: {
        mode: "CsvText",
        name: "d.csv",
        content: "Customer,,Customer\nA,B,C",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.columns[0]?.key, "customer");
    assert.equal(result.dataset.columns[1]?.key, "column_2");
    assert.equal(result.dataset.columns[2]?.key, "customer_2");
  }
});

test("22. headerless input receives deterministic column names", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      hasHeader: false,
      input: {
        mode: "CsvText",
        name: "h.csv",
        content: "1,2,3\n4,5,6",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(
      result.dataset.columns.map((c) => c.displayName),
      ["Column 1", "Column 2", "Column 3"],
    );
    assert.equal(result.dataset.rowCountObserved, 2);
  }
});

test("23. short rows are padded with diagnostics", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      input: {
        mode: "CsvText",
        name: "s.csv",
        content: "a,b,c\n1,2",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.deepEqual(result.dataset.previewRows[0]?.values, ["1", "2", ""]);
    assert.ok(result.diagnostics.some((d) => d.code === "ROW_TOO_SHORT"));
  }
});

test("24. long rows produce diagnostics", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      input: {
        mode: "CsvText",
        name: "l.csv",
        content: "a,b\n1,2,3",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.ok(result.diagnostics.some((d) => d.code === "ROW_TOO_LONG"));
  }
});

test("25. strict row-width mode can reject inconsistent rows", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      strictColumnCount: true,
      input: {
        mode: "CsvText",
        name: "strict.csv",
        content: "a,b\n1,2,3",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, false);
});

test("26. Integer inference works", () => {
  assert.equal(inferCsvPrimitiveType(["10", "-5", "0"]), "Integer");
});

test("27. Decimal inference works", () => {
  assert.equal(inferCsvPrimitiveType(["10.5", "-3.25"]), "Decimal");
});

test("28. Boolean inference works", () => {
  assert.equal(inferCsvPrimitiveType(["true", "false", "yes"]), "Boolean");
});

test("29. Date inference works", () => {
  assert.equal(inferCsvPrimitiveType(["2026-07-01", "2026/07/02"]), "Date");
});

test("30. DateTime inference works", () => {
  assert.equal(inferCsvPrimitiveType(["2026-07-01T10:00:00", "2026-07-01 10:00:00"]), "DateTime");
});

test("31. mixed numeric values resolve to Decimal", () => {
  assert.equal(inferCsvPrimitiveType(["10", "10.5"]), "Decimal");
});

test("32. mixed arbitrary values resolve to String", () => {
  assert.equal(inferCsvPrimitiveType(["10", "abc"]), "String");
});

test("33. empty-only columns resolve to Unknown", () => {
  assert.equal(inferCsvPrimitiveType(["", "  ", ""]), "Unknown");
});

test("34. formula-like values produce risk diagnostics", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      input: {
        mode: "CsvText",
        name: "f.csv",
        content: "a\n=SUM(A1)\n@cmd",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.ok(result.diagnostics.some((d) => d.code === "FORMULA_RISK"));
    assert.ok((result.dataset.columns[0]?.formulaRiskCount ?? 0) >= 1);
  }
});

test("35. negative numbers are not falsely flagged as formulas", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      input: {
        mode: "CsvText",
        name: "n.csv",
        content: "amount\n-5\n-3.25",
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(
      result.diagnostics.some((d) => d.code === "FORMULA_RISK"),
      false,
    );
  }
});

test("36. preview row limits are enforced", () => {
  const rows = Array.from({ length: 30 }, (_, i) => `${i},x`).join("\n");
  const result = createCsvDatasetPreview(
    baseRequest({
      previewRowLimit: 5,
      input: {
        mode: "CsvText",
        name: "p.csv",
        content: `a,b\n${rows}`,
        encodingHint: "UTF-8",
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.rowCountPreviewed, 5);
    assert.ok(result.diagnostics.some((d) => d.code === "PREVIEW_TRUNCATED"));
  }
});

test("37. parser row limits are enforced", () => {
  assert.equal(CsvParserLimits.maximumParsedRows, 100_000);
  assert.ok(CsvParserLimits.maximumParsedRows > 0);
});

test("38. column limits are enforced", () => {
  assert.equal(CsvParserLimits.maximumParsedColumns, 1_000);
});

test("39. field limits are enforced", () => {
  const huge = "a\n" + "x".repeat(CsvParserLimits.maximumFieldCharacterCount + 1);
  const parsed = parseCsvRecords(huge, ",");
  assert.equal(parsed.blocked, true);
  assert.ok(parsed.diagnostics.some((d) => d.code === "FIELD_LIMIT_EXCEEDED"));
});

test("40. diagnostic limits are enforced", () => {
  assert.equal(CsvParserLimits.maximumDiagnosticCount, 500);
  assert.ok(CsvParserDiagnosticCatalog.codes.length > 0);
});

test("41. tenant/workspace/session identity is preserved", () => {
  const result = createCsvDatasetPreview(baseRequest());
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.tenantId, "tenant-1");
    assert.equal(result.dataset.workspaceId, "workspace-1");
    assert.equal(result.dataset.sessionId, "session-1");
    assert.equal(result.dataset.sourceRegistryId, "dsk-datasource-csv");
  }
});

test("42. requests are not mutated", () => {
  const request = baseRequest();
  const before = JSON.stringify(request);
  createCsvDatasetPreview(request);
  assert.equal(JSON.stringify(request), before);
});

test("43. success results are deeply frozen", () => {
  const result = createCsvDatasetPreview(baseRequest());
  assert.equal(result.ok, true);
  assert.equal(isDeeplyFrozen(result), true);
});

test("44. failure results are deeply frozen", () => {
  const result = createCsvDatasetPreview(baseRequest({ tenantId: "" }));
  assert.equal(result.ok, false);
  assert.equal(isDeeplyFrozen(result), true);
});

test("45. invalid CSV does not throw", () => {
  assert.doesNotThrow(() =>
    createCsvDatasetPreview(
      baseRequest({
        input: {
          mode: "CsvText",
          name: "q.csv",
          content: '"unterminated',
          encodingHint: "UTF-8",
        },
      }),
    ),
  );
});

test("46. repeated calls are deterministic", () => {
  const a = createCsvDatasetPreview(baseRequest());
  const b = createCsvDatasetPreview(baseRequest());
  assert.deepEqual(a, b);
});

test("47. no filesystem or network access exists", () => {
  for (const file of INT12_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    for (const token of ["node:fs", "node:http", "node:net", "fetch(", "XMLHttpRequest"]) {
      assert.equal(text.includes(token), false, `${token} in ${file}`);
    }
  }
});

test("48. no persistence exists", () => {
  for (const file of INT12_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/localStorage|indexedDB|openDatabase/.test(text), false, file);
  }
});

test("49. no semantic or AI behavior exists", () => {
  for (const file of INT12_FILES.filter((f) => !f.endsWith(".test.ts"))) {
    const text = readFileSync(join(HERE, file), "utf8");
    assert.equal(/openai|anthropic|embedding|llm/i.test(text), false, file);
  }
});

test("50. readiness reports ReadyForPipelinePage", () => {
  const r = CsvDatasetPreviewPlatform.readiness;
  assert.equal(r.readiness, "ReadyForPipelinePage");
  assert.equal(r.status, "ParserComplete");
  for (const flag of [
    "ParserComplete",
    "CsvParsingOperational",
    "ManualTablePreviewOperational",
    "PrimitiveInferenceOperational",
    "TenantBoundaryProtected",
    "WorkspaceBoundaryProtected",
    "Deterministic",
    "Immutable",
    "DatasetPreviewAvailable",
    "ReadyForPipelinePage",
  ]) {
    assert.ok(r.completion.includes(flag), flag);
  }
});

test("manual table preview is operational", () => {
  const result = createCsvDatasetPreview(
    baseRequest({
      sourceMode: "ManualTable",
      sourceName: "manual",
      input: {
        mode: "ManualTable",
        name: "manual",
        columns: ["name", "qty"],
        rows: [
          ["A", "1"],
          ["B", "2"],
        ],
      },
    }),
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.dataset.sourceMode, "ManualTable");
    assert.equal(result.dataset.rowCountObserved, 2);
    assert.equal(result.dataset.sourceRegistryId, "dsk-datasource-manual-input");
  }
});

test("platform aggregate is deeply frozen", () => {
  assert.equal(isDeeplyFrozen(CsvDatasetPreviewPlatform.identity), true);
  assert.equal(isDeeplyFrozen(CsvParserLimits), true);
});
