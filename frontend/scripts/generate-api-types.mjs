import fs from "node:fs";
import path from "node:path";

const [, , inputArg, outputArg] = process.argv;

if (!inputArg || !outputArg) {
  console.error("Usage: node scripts/generate-api-types.mjs <openapi.json> <generated.ts>");
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg);
const openapi = JSON.parse(fs.readFileSync(inputPath, "utf8"));

function sanitizeTypeName(name) {
  return String(name).replace(/[^A-Za-z0-9_]/g, "_");
}

function schemaToTs(schema) {
  if (!schema) return "unknown";

  if (schema.$ref) {
    return sanitizeTypeName(schema.$ref.split("/").pop());
  }

  if (Array.isArray(schema.anyOf) && schema.anyOf.length) {
    return schema.anyOf.map(schemaToTs).join(" | ");
  }

  if (Array.isArray(schema.oneOf) && schema.oneOf.length) {
    return schema.oneOf.map(schemaToTs).join(" | ");
  }

  if (Array.isArray(schema.allOf) && schema.allOf.length) {
    return schema.allOf.map(schemaToTs).join(" & ");
  }

  if (Array.isArray(schema.enum) && schema.enum.length) {
    return schema.enum.map((value) => JSON.stringify(value)).join(" | ");
  }

  if (schema.type === "array") {
    return `Array<${schemaToTs(schema.items)}>`;
  }

  if (schema.type === "object" || schema.properties || schema.additionalProperties) {
    const properties = schema.properties ?? {};
    const required = new Set(schema.required ?? []);
    const lines = Object.entries(properties).map(([key, value]) => {
      const optional = required.has(key) ? "" : "?";
      return `  ${JSON.stringify(key)}${optional}: ${schemaToTs(value)};`;
    });

    if (schema.additionalProperties && schema.additionalProperties !== true) {
      lines.push(`  [key: string]: ${schemaToTs(schema.additionalProperties)};`);
    } else if (schema.additionalProperties === true && Object.keys(properties).length === 0) {
      return "Record<string, unknown>";
    } else if (schema.additionalProperties === true) {
      lines.push("  [key: string]: unknown;");
    }

    return lines.length ? `{\n${lines.join("\n")}\n}` : "Record<string, unknown>";
  }

  if (schema.type === "string") return "string";
  if (schema.type === "integer" || schema.type === "number") return "number";
  if (schema.type === "boolean") return "boolean";
  if (schema.type === "null") return "null";

  return "unknown";
}

function operationType(pathName, method, operation) {
  const requestSchema =
    operation?.requestBody?.content?.["application/json"]?.schema ?? null;
  const responseSchema =
    operation?.responses?.["200"]?.content?.["application/json"]?.schema ?? null;

  return [
    `    ${method}: {`,
    `      request: ${schemaToTs(requestSchema)};`,
    `      response: ${schemaToTs(responseSchema)};`,
    "    };",
  ].join("\n");
}

const schemaEntries = Object.entries(openapi.components?.schemas ?? {}).sort(([a], [b]) =>
  a.localeCompare(b)
);

const pathEntries = Object.entries(openapi.paths ?? {}).sort(([a], [b]) =>
  a.localeCompare(b)
);

const output = [
  "/* eslint-disable */",
  "// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.",
  `// Source: ${path.relative(path.dirname(outputPath), inputPath)}`,
  "",
  ...schemaEntries.map(([name, schema]) => `export type ${sanitizeTypeName(name)} = ${schemaToTs(schema)};`),
  "",
  "export type ApiOperations = {",
  ...pathEntries.map(([pathName, methods]) => {
    const methodLines = Object.entries(methods)
      .filter(([method]) => ["get", "post", "put", "patch", "delete"].includes(method))
      .map(([method, operation]) => operationType(pathName, method, operation));
    return `  ${JSON.stringify(pathName)}: {\n${methodLines.join("\n")}\n  };`;
  }),
  "};",
  "",
].join("\n");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, "utf8");
console.log(outputPath);
