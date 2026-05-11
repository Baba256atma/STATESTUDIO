"""
Nexora Intelligence Connection System

Run inside Blender with an existing scene containing:
- Core Object / Nexora Core
- Risk Object
- Signal Object

This script adds semantic connection layers only. It does not modify the
existing object meshes. Re-running is safe: the generated connection collection
is replaced, preventing duplicate wires, pulses, and orbit arcs.
"""

from __future__ import annotations

import math
from mathutils import Vector

import bpy


COLLECTION_NAME = "Nexora Intelligence Connections"
FRAME_START = 1
FRAME_END = 160


def clean_generated_collection() -> bpy.types.Collection:
    existing = bpy.data.collections.get(COLLECTION_NAME)
    if existing:
        for obj in list(existing.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
        for child in list(existing.children):
            bpy.data.collections.remove(child)
        return existing

    collection = bpy.data.collections.new(COLLECTION_NAME)
    bpy.context.scene.collection.children.link(collection)
    return collection


def find_scene_object(*keywords: str) -> bpy.types.Object | None:
    normalized_keywords = tuple(keyword.lower() for keyword in keywords)
    generated = bpy.data.collections.get(COLLECTION_NAME)
    generated_names = {obj.name for obj in generated.objects} if generated else set()

    best: bpy.types.Object | None = None
    best_score = -1
    for obj in bpy.context.scene.objects:
        if obj.name in generated_names:
            continue
        name = obj.name.lower()
        score = sum(1 for keyword in normalized_keywords if keyword in name)
        if score > best_score and score > 0:
            best = obj
            best_score = score
    return best


def make_emission_material(
    name: str,
    color: tuple[float, float, float, float],
    strength: float,
    pulse_values: list[tuple[int, float]] | None = None,
) -> bpy.types.Material:
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    material.blend_method = "BLEND"
    material.use_screen_refraction = True
    material.show_transparent_back = True

    nodes = material.node_tree.nodes
    for node in nodes:
        node.select = False

    bsdf = nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Alpha"].default_value = color[3]
        bsdf.inputs["Emission Color"].default_value = color
        bsdf.inputs["Emission Strength"].default_value = strength
        bsdf.inputs["Base Color"].default_value = color
        if pulse_values:
            strength_input = bsdf.inputs["Emission Strength"]
            for frame, value in pulse_values:
                strength_input.default_value = value
                strength_input.keyframe_insert("default_value", frame=frame)
    return material


def quadratic_bezier(start: Vector, control: Vector, end: Vector, steps: int) -> list[Vector]:
    points: list[Vector] = []
    for index in range(steps):
        t = index / max(1, steps - 1)
        point = ((1 - t) ** 2 * start) + (2 * (1 - t) * t * control) + (t**2 * end)
        points.append(point)
    return points


def make_curve(
    name: str,
    points: list[Vector],
    material: bpy.types.Material,
    collection: bpy.types.Collection,
    bevel_depth: float,
    resolution: int = 3,
) -> bpy.types.Object:
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = resolution
    curve.bevel_depth = bevel_depth
    curve.bevel_resolution = 4
    curve.use_path = True
    curve.path_duration = FRAME_END - FRAME_START

    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for spline_point, point in zip(spline.points, points):
        spline_point.co = (point.x, point.y, point.z, 1)

    obj = bpy.data.objects.new(name, curve)
    obj.data.materials.append(material)
    obj["nexora_meaning"] = "semantic intelligence connection"
    collection.objects.link(obj)
    return obj


def sample_path(points: list[Vector], t: float) -> Vector:
    if not points:
        return Vector((0, 0, 0))
    t = max(0.0, min(1.0, t))
    raw = t * (len(points) - 1)
    idx = int(math.floor(raw))
    nxt = min(len(points) - 1, idx + 1)
    local_t = raw - idx
    return points[idx].lerp(points[nxt], local_t)


def make_pulse(
    name: str,
    points: list[Vector],
    material: bpy.types.Material,
    collection: bpy.types.Collection,
    radius: float,
    frame_offset: int,
    jitter: float = 0.0,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=12, radius=radius, location=points[0])
    pulse = bpy.context.object
    pulse.name = name
    pulse.data.name = f"{name} Mesh"
    pulse.data.materials.append(material)
    pulse["nexora_meaning"] = "moving intelligence packet"

    for frame in range(FRAME_START, FRAME_END + 1, 20):
        phase = ((frame - FRAME_START + frame_offset) % (FRAME_END - FRAME_START)) / (FRAME_END - FRAME_START)
        location = sample_path(points, phase)
        if jitter:
            location = location + Vector(
                (
                    math.sin(frame * 0.17 + frame_offset) * jitter,
                    math.cos(frame * 0.11 + frame_offset) * jitter,
                    math.sin(frame * 0.09) * jitter * 0.5,
                )
            )
        pulse.location = location
        pulse.scale = (1.0 + 0.18 * math.sin(frame * 0.09 + frame_offset),) * 3
        pulse.keyframe_insert("location", frame=frame)
        pulse.keyframe_insert("scale", frame=frame)

    for collection_ref in list(pulse.users_collection):
        collection_ref.objects.unlink(pulse)
    collection.objects.link(pulse)
    return pulse


def make_orbit_arc(
    name: str,
    center: Vector,
    radius: float,
    z: float,
    start_angle: float,
    end_angle: float,
    material: bpy.types.Material,
    collection: bpy.types.Collection,
    bevel_depth: float,
    wobble: float = 0.0,
) -> bpy.types.Object:
    points: list[Vector] = []
    steps = 72
    for index in range(steps):
        t = index / max(1, steps - 1)
        angle = start_angle + (end_angle - start_angle) * t
        local_radius = radius + math.sin(t * math.tau * 2.0) * wobble
        points.append(
            Vector(
                (
                    center.x + math.cos(angle) * local_radius,
                    center.y + math.sin(angle) * local_radius,
                    center.z + z + math.sin(angle * 1.7) * wobble * 0.35,
                )
            )
        )
    arc = make_curve(name, points, material, collection, bevel_depth)
    arc.rotation_euler[2] = 0
    arc.keyframe_insert("rotation_euler", frame=FRAME_START)
    arc.rotation_euler[2] = math.radians(18)
    arc.keyframe_insert("rotation_euler", frame=FRAME_END)
    return arc


def build_signal_connection(
    signal: bpy.types.Object,
    core: bpy.types.Object,
    collection: bpy.types.Collection,
    signal_material: bpy.types.Material,
    signal_pulse_material: bpy.types.Material,
) -> None:
    start = signal.location.copy()
    end = core.location.copy()
    direction = (end - start).normalized()
    lift = Vector((0, 0, 1.25))
    side = direction.cross(Vector((0, 0, 1))).normalized()
    if side.length == 0:
        side = Vector((1, 0, 0))
    control = start.lerp(end, 0.52) + lift + side * 0.45
    points = quadratic_bezier(start, control, end, 96)

    curve = make_curve(
        "Signal_to_Core__calm_monitoring_feed",
        points,
        signal_material,
        collection,
        bevel_depth=0.018,
    )
    curve["nexora_meaning"] = "Signal detects environment; intelligence feeds calmly into Core."

    make_orbit_arc(
        "Signal_Core__stable_intelligence_orbit",
        core.location.copy(),
        radius=max(1.25, (end - start).length * 0.42),
        z=0.18,
        start_angle=math.radians(20),
        end_angle=math.radians(300),
        material=signal_material,
        collection=collection,
        bevel_depth=0.01,
        wobble=0.015,
    )

    make_pulse("Signal_Pulse__packet_A", points, signal_pulse_material, collection, 0.055, frame_offset=0)
    make_pulse("Signal_Pulse__packet_B", points, signal_pulse_material, collection, 0.038, frame_offset=75)


def build_risk_connection(
    risk: bpy.types.Object,
    core: bpy.types.Object,
    collection: bpy.types.Collection,
    risk_material: bpy.types.Material,
    risk_pulse_material: bpy.types.Material,
) -> None:
    start = risk.location.copy()
    end = core.location.copy()
    direction = (end - start).normalized()
    side = direction.cross(Vector((0, 0, 1))).normalized()
    if side.length == 0:
        side = Vector((1, 0, 0))
    control = start.lerp(end, 0.48) + Vector((0, 0, 0.95)) - side * 0.68
    raw_points = quadratic_bezier(start, control, end, 104)

    unstable_points = [
        point
        + Vector(
            (
                math.sin(index * 0.41) * 0.045,
                math.cos(index * 0.29) * 0.035,
                math.sin(index * 0.23) * 0.05,
            )
        )
        for index, point in enumerate(raw_points)
    ]

    segment_ranges = [(0.04, 0.22), (0.29, 0.45), (0.52, 0.68), (0.74, 0.93)]
    for index, (start_t, end_t) in enumerate(segment_ranges, start=1):
        segment = [
            sample_path(unstable_points, start_t + (end_t - start_t) * (step / 22))
            for step in range(23)
        ]
        curve = make_curve(
            f"Risk_to_Core__fragmented_propagation_{index}",
            segment,
            risk_material,
            collection,
            bevel_depth=0.022 if index in (2, 3) else 0.016,
            resolution=2,
        )
        curve["nexora_meaning"] = "Risk propagates imperfectly toward Core; instability is fragmented."

    make_orbit_arc(
        "Risk_Core__imperfect_instability_orbit",
        core.location.copy(),
        radius=max(1.2, (end - start).length * 0.36),
        z=-0.08,
        start_angle=math.radians(205),
        end_angle=math.radians(555),
        material=risk_material,
        collection=collection,
        bevel_depth=0.012,
        wobble=0.09,
    )

    make_pulse("Risk_Pulse__propagation_A", unstable_points, risk_pulse_material, collection, 0.06, 15, jitter=0.045)
    make_pulse("Risk_Pulse__propagation_B", unstable_points, risk_pulse_material, collection, 0.045, 63, jitter=0.07)


def add_connection_labels(collection: bpy.types.Collection, core: bpy.types.Object) -> None:
    font_curve = bpy.data.curves.new("Nexora_Connection_Meaning_Label", "FONT")
    font_curve.body = "Signal detects  •  Risk propagates  •  Core decides"
    font_curve.align_x = "CENTER"
    font_curve.size = 0.16
    font_curve.align_y = "CENTER"
    label = bpy.data.objects.new("Nexora_Ecosystem_Meaning", font_curve)
    label.location = core.location + Vector((0, -2.4, 1.35))
    label.rotation_euler[0] = math.radians(68)
    label["nexora_meaning"] = "scene-level semantic explanation"
    collection.objects.link(label)


def configure_scene_timing() -> None:
    bpy.context.scene.frame_start = FRAME_START
    bpy.context.scene.frame_end = FRAME_END
    bpy.context.scene.render.fps = 24


def main() -> None:
    collection = clean_generated_collection()

    core = find_scene_object("core") or find_scene_object("nexora")
    risk = find_scene_object("risk")
    signal = find_scene_object("signal")

    missing = [
        name
        for name, obj in (("Core Object", core), ("Risk Object", risk), ("Signal Object", signal))
        if obj is None
    ]
    if missing:
        raise RuntimeError(f"Missing required Nexora scene object(s): {', '.join(missing)}")

    signal_material = make_emission_material(
        "Nexora_Signal_Cyan_Glow",
        (0.08, 0.82, 1.0, 0.55),
        1.6,
        [(1, 1.35), (55, 1.75), (110, 1.45), (160, 1.7)],
    )
    signal_pulse_material = make_emission_material(
        "Nexora_Signal_Pulse_CoreFeed",
        (0.35, 0.95, 1.0, 0.82),
        3.8,
        [(1, 2.8), (50, 4.2), (100, 3.1), (160, 4.0)],
    )
    risk_material = make_emission_material(
        "Nexora_Risk_Orange_Fragmented_Glow",
        (1.0, 0.24, 0.08, 0.62),
        2.3,
        [(1, 1.4), (19, 3.1), (47, 1.8), (83, 3.8), (129, 1.6), (160, 3.0)],
    )
    risk_pulse_material = make_emission_material(
        "Nexora_Risk_Pulse_Propagation",
        (1.0, 0.12, 0.02, 0.9),
        5.0,
        [(1, 2.6), (23, 6.4), (51, 3.0), (94, 7.0), (136, 2.4), (160, 5.7)],
    )

    build_signal_connection(signal, core, collection, signal_material, signal_pulse_material)
    build_risk_connection(risk, core, collection, risk_material, risk_pulse_material)
    add_connection_labels(collection, core)
    configure_scene_timing()

    print("[Nexora][Blender][IntelligenceConnectionsReady]")


if __name__ == "__main__":
    main()
