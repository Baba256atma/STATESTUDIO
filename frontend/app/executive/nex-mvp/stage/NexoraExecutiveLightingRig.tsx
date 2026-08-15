"use client";

import { useEffect, useMemo, useRef } from "react";
import type {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
} from "three";
import type { ExecutiveLightingConfiguration } from "@/app/lib/spatial-presentation/executiveLightingFoundation";
import { toExecutiveLightingTuple } from "@/app/lib/spatial-presentation/executiveLightingFoundation";

type Props = {
  readonly lighting: ExecutiveLightingConfiguration;
};

/**
 * SP:3.1 — R3F consumer of resolved executive lighting configuration.
 * Presentation boundary only — no business logic, no Stage semantics.
 */
export function NexoraExecutiveLightingRig({ lighting }: Props) {
  const ambientRef = useRef<AmbientLight>(null);
  const keyRef = useRef<DirectionalLight>(null);
  const fillRef = useRef<DirectionalLight>(null);
  const rimRef = useRef<DirectionalLight>(null);
  const hemisphereRef = useRef<HemisphereLight>(null);

  const { tokens, shadow } = lighting;
  const keyPosition = useMemo(
    () => toExecutiveLightingTuple(tokens.keyPosition),
    [tokens.keyPosition],
  );
  const fillPosition = useMemo(
    () => toExecutiveLightingTuple(tokens.fillPosition),
    [tokens.fillPosition],
  );
  const rimPosition = useMemo(
    () => toExecutiveLightingTuple(tokens.rimPosition),
    [tokens.rimPosition],
  );

  useEffect(() => {
    const key = keyRef.current;
    if (key == null) return;

    key.castShadow = shadow.enabled;
    if (!shadow.enabled) return;

    key.shadow.bias = shadow.bias;
    key.shadow.normalBias = shadow.normalBias;
    key.shadow.mapSize.set(shadow.mapSize, shadow.mapSize);
    key.shadow.camera.near = shadow.camera.near;
    key.shadow.camera.far = shadow.camera.far;
    key.shadow.camera.left = -shadow.camera.size;
    key.shadow.camera.right = shadow.camera.size;
    key.shadow.camera.top = shadow.camera.size;
    key.shadow.camera.bottom = -shadow.camera.size;
    key.shadow.intensity = shadow.softIntensityBias;
    key.shadow.camera.updateProjectionMatrix();
  }, [shadow]);

  useEffect(() => {
    if (ambientRef.current) {
      ambientRef.current.intensity = tokens.ambientIntensity;
    }
    if (keyRef.current) {
      keyRef.current.intensity = tokens.keyIntensity;
      keyRef.current.color.set(tokens.keyColor);
      keyRef.current.position.set(
        tokens.keyPosition.x,
        tokens.keyPosition.y,
        tokens.keyPosition.z,
      );
    }
    if (fillRef.current) {
      fillRef.current.intensity = tokens.fillIntensity;
      fillRef.current.color.set(tokens.fillColor);
      fillRef.current.position.set(
        tokens.fillPosition.x,
        tokens.fillPosition.y,
        tokens.fillPosition.z,
      );
      fillRef.current.castShadow = false;
    }
    if (rimRef.current) {
      rimRef.current.intensity = tokens.rimIntensity;
      rimRef.current.color.set(tokens.rimColor);
      rimRef.current.position.set(
        tokens.rimPosition.x,
        tokens.rimPosition.y,
        tokens.rimPosition.z,
      );
      rimRef.current.castShadow = false;
    }
    if (hemisphereRef.current) {
      hemisphereRef.current.intensity =
        tokens.groundResponse.hemisphereIntensity;
      hemisphereRef.current.color.set(tokens.groundResponse.skyColor);
      hemisphereRef.current.groundColor.set(tokens.groundResponse.groundColor);
    }
  }, [tokens]);

  return (
    <group
      userData={{
        identity: lighting.identity,
        version: lighting.version,
        profileId: lighting.profileId,
        architecturalRole: "PresentationOnlyExecutiveLightingFoundation",
      }}
    >
      <ambientLight ref={ambientRef} intensity={tokens.ambientIntensity} />
      <hemisphereLight
        ref={hemisphereRef}
        args={[
          tokens.groundResponse.skyColor,
          tokens.groundResponse.groundColor,
          tokens.groundResponse.hemisphereIntensity,
        ]}
      />
      <directionalLight
        ref={keyRef}
        position={keyPosition}
        intensity={tokens.keyIntensity}
        color={tokens.keyColor}
        castShadow={shadow.enabled}
      />
      <directionalLight
        ref={fillRef}
        position={fillPosition}
        intensity={tokens.fillIntensity}
        color={tokens.fillColor}
        castShadow={false}
      />
      <directionalLight
        ref={rimRef}
        position={rimPosition}
        intensity={tokens.rimIntensity}
        color={tokens.rimColor}
        castShadow={false}
      />
    </group>
  );
}
