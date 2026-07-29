import assert from "node:assert/strict";
import test from "node:test";
import { createFireMaterial } from "../shaders/FireMaterial.ts";

test("AD-R3F-01 fire material: stable create + single dispose", () => {
  const material = createFireMaterial();
  assert.equal(material.type, "ShaderMaterial");
  assert.ok(material.uniforms.time);
  assert.ok(material.uniforms.intensity);
  assert.ok(material.uniforms.opacity);
  material.uniforms.time.value = 1.25;
  assert.equal(material.uniforms.time.value, 1.25);
  material.dispose();
  // Second dispose must not throw (Three.js dispose is idempotent for ShaderMaterial).
  material.dispose();
});

test("AD-R3F-01 fire material: each factory call creates a distinct identity", () => {
  const a = createFireMaterial();
  const b = createFireMaterial();
  assert.notEqual(a, b);
  a.dispose();
  b.dispose();
});
