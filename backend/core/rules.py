# backend/core/rules.py
import re
import math

def clamp01(x: float) -> float:
    return max(0.0, min(1.0, x))

def detect_character_archetype(text: str) -> str | None:
    t = text.lower()
    if re.search(r"\bwarrior\b|\bfighter\b|\bsoldier\b|جنگجو|رزمی", t):
        return "warrior"
    if re.search(r"\bmage\b|\bwizard\b|\bsorcerer\b|جادوگر", t):
        return "mage"
    if re.search(r"\bhealer\b|\bsupport\b|شفادهنده|درمانگر", t):
        return "healer"
    if re.search(r"\brogue\b|\bassassin\b|\bthief\b|قاتل|دزد", t):
        return "rogue"
    return None

def detect_character_mood(text: str) -> str | None:
    t = text.lower()
    if re.search(r"calm|relaxed|آرام|ساکت", t):
        return "calm"
    if re.search(r"focused|sharp|متمرکز|حواس جمع", t):
        return "focused"
    if re.search(r"aggressive|angry|خشن|عصبانی", t):
        return "aggressive"
    if re.search(r"sad|upset|غمگین|دلگیر", t):
        return "sad"
    if re.search(r"confident|bold|جسور|بااعتماد", t):
        return "confident"
    return None

def detect_topics(text: str) -> set[str]:
    t = text.lower()

    topics = set()

    # business
    if re.search(r"\binventory\b|موجودی|انبار|stock", t):
        topics.add("inventory")
    if re.search(r"\bquality\b|کیفیت|defect|خطا|خرابی", t):
        topics.add("quality")
    if re.search(r"\bsafety\b|ایمنی|حادثه|risk|خطر", t):
        topics.add("safety")
    if re.search(r"\bdelay\b|time|زمان|تاخیر|تأخیر|schedule", t):
        topics.add("time")
    if re.search(r"\blabor\b|نیرو|کارگر|پرسنل|staff", t):
        topics.add("labor")
    if re.search(r"\bequipment\b|تجهیز|دستگاه|ماشین|machine", t):
        topics.add("equipment")

    # spirit (future-facing, currently detection only)
    if re.search(r"spirit|energy|aura|قلب|ریشه|گلو|چشم|تاج", t):
        topics.add("spirit")

    # character (future-facing)
    if re.search(r"character|avatar|persona|archetype|warrior|mage|healer|rogue|کاراکتر|شخصیت|آواتار", t):
        topics.add("character")

    # chaos
    if re.search(r"chaos|unstable|instability|nonlinear|attractor|آشوب|بی‌ثبات|نوسان|جاذب|غیرخطی", t):
        topics.add("chaos")

    return topics

def chaos_defaults(user_text: str) -> dict:
    t = user_text.lower()
    attractor = "lorenz_like"
    if "rossler" in t or "روسلر" in t:
        attractor = "rossler_like"
    if "lorenz" in t or "لورنتس" in t:
        attractor = "lorenz_like"
    if "random" in t:
        attractor = "random_walk"

    instability = 0.6
    noise = 0.35
    if "very unstable" in t or "خیلی بی‌ثبات" in t:
        instability = 0.85
        noise = 0.5

    return {"instability": clamp01(instability), "noise": clamp01(noise), "attractor": attractor}

def _pseudo_rand(i: int, seed: float = 0.0) -> float:
    # deterministic pseudo-random in [0,1)
    return (math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1.0

def generate_orbit(attractor: str, steps: int, noise: float) -> list[list[float]]:
    x, y, z = 0.1, 0.0, 0.0
    dt = 0.01
    pts = []
    for i in range(steps):
        if attractor == "rossler_like":
            dx = (-y - z) * 0.6
            dy = (x + 0.2 * y) * 0.4
            dz = (0.2 + z * (x - 5.7)) * 0.15
        elif attractor == "random_walk":
            dx = (_pseudo_rand(i, 1.0) - 0.5) * 0.5
            dy = (_pseudo_rand(i, 2.0) - 0.5) * 0.5
            dz = (_pseudo_rand(i, 3.0) - 0.5) * 0.5
        else:
            dx = 10 * (y - x)
            dy = (28 * x - y - x * z)
            dz = (x * y - (8 / 3) * z)

        n = (math.sin(i * 0.61) + math.cos(i * 0.37)) * 0.5 * noise
        x += (dx * dt) + n * 0.02
        y += (dy * dt) + n * 0.02
        z += (dz * dt) + n * 0.02

        # keep bounded
        x = clamp01((x + 2) / 4) * 4 - 2
        y = clamp01((y + 2) / 4) * 4 - 2
        z = clamp01((z + 2) / 4) * 4 - 2

        pts.append([x * 0.5, y * 0.5, z * 0.5])
    return pts


def apply_topics(scene_json: dict, topics: set[str], user_text: str = "") -> dict:
    """
    Simple version:
    - each topic adds one object to the scene
    - state_vector is slightly adjusted
    - domain_model.business is lightly updated
    """
    objs = []
    anims = []

    # Center point: overall status
    objs.append({
        "id": "obj_core",
        "type": "sphere",
        "transform": {"pos": [0, 0, 0], "scale": [1.0, 1.0, 1.0]},
        "material": {"color": "auto", "opacity": 0.9},
        "tags": ["state_core"],
    })
    anims.append({"target": "obj_core", "type": "pulse", "intensity": 0.3})

    # shortcuts
    biz = scene_json["domain_model"]["business"]
    sv = scene_json["state_vector"]

    if "inventory" in topics:
        biz["inventory"]["status"] = "low"
        biz["inventory"]["quantity"] = max(0, biz["inventory"]["quantity"] - 20)
        sv["inventory_pressure"] = clamp01(sv["inventory_pressure"] + 0.4)

        objs.append({
            "id": "obj_inventory",
            "type": "box",
            "transform": {"pos": [-2, 0, 0], "scale": [1.0, 1.0, 1.0]},
            "material": {"color": "#ffaa00", "opacity": 0.85},
            "tags": ["inventory"],
        })

    if "quality" in topics:
        biz["quality"]["status"] = "warning"
        biz["quality"]["defect_rate"] = min(1.0, biz["quality"]["defect_rate"] + 0.03)
        sv["quality_risk"] = clamp01(sv["quality_risk"] + 0.4)

        objs.append({
            "id": "obj_quality",
            "type": "icosahedron",
            "transform": {"pos": [2, 0, 0], "scale": [1.0, 1.0, 1.0]},
            "material": {"color": "#ff4444", "opacity": 0.85},
            "tags": ["quality"],
        })
        anims.append({"target": "obj_quality", "type": "wobble", "intensity": 0.6})

    if "safety" in topics:
        biz["safety"]["status"] = "warning"
        biz["safety"]["risk_level"] = clamp01(biz["safety"]["risk_level"] + 0.4)

        objs.append({
            "id": "obj_safety",
            "type": "cone",
            "transform": {"pos": [0, 0, -2], "scale": [1.0, 1.0, 1.0]},
            "material": {"color": "#ff0000", "opacity": 0.85},
            "tags": ["safety"],
        })

    if "time" in topics:
        biz["time"]["schedule_status"] = "delayed"
        biz["time"]["delay_days"] = biz["time"]["delay_days"] + 1
        sv["time_pressure"] = clamp01(sv["time_pressure"] + 0.4)

        objs.append({
            "id": "obj_time",
            "type": "torus",
            "transform": {"pos": [0, 0, 2], "scale": [1.0, 1.0, 1.0]},
            "material": {"color": "#44aaff", "opacity": 0.85},
            "tags": ["time"],
        })
        anims.append({"target": "obj_time", "type": "spin", "intensity": 0.4})

    # If spirit/character detected, mark domain in meta (scene added in later steps)
    if "spirit" in topics:
        scene_json["meta"]["domain"] = "spirit"
    if "character" in topics:
        scene_json["meta"]["domain"] = "character"
        archetype = detect_character_archetype(user_text) or "unknown"
        mood = detect_character_mood(user_text) or "neutral"

        palettes = {
            "warrior": {"primary": "#d64545", "accent": "#ff8800"},
            "mage": {"primary": "#3a6bdc", "accent": "#8844ff"},
            "healer": {"primary": "#2fb86f", "accent": "#37d6c4"},
            "rogue": {"primary": "#6a6a6a", "accent": "#7c5cff"},
        }
        traits_by_arch = {
            "warrior": {"strength": 0.9, "courage": 0.8, "wisdom": 0.3, "empathy": 0.3},
            "mage": {"strength": 0.3, "courage": 0.6, "wisdom": 0.9, "empathy": 0.4},
            "healer": {"strength": 0.3, "courage": 0.5, "wisdom": 0.7, "empathy": 0.9},
            "rogue": {"strength": 0.6, "courage": 0.7, "wisdom": 0.5, "empathy": 0.2},
        }

        palette = palettes.get(archetype, {"primary": "#999999", "accent": "#bbbbbb"})
        traits = traits_by_arch.get(archetype, {"strength": 0.4, "courage": 0.4, "wisdom": 0.4, "empathy": 0.4})

        scene_json["domain_model"]["character"] = {
            "archetype": archetype,
            "mood": mood,
            "traits": traits,
            "palette": palette,
        }

        body_type = {
            "warrior": "cone",
            "mage": "icosahedron",
            "healer": "sphere",
            "rogue": "cylinder",
        }.get(archetype, "box")

        objs.append({
            "id": "obj_character_body",
            "type": body_type,
            "transform": {"pos": [0, 0.8, 0], "scale": [1.0, 1.0, 1.0]},
            "material": {
                "color": palette["primary"],
                "opacity": 0.92,
                "emissive": palette["accent"],
                "emissiveIntensity": 0.6,
            },
            "tags": ["character", "character_body"],
        })
        anims.append({"target": "obj_character_body", "type": "pulse", "intensity": 0.4})

        aura_spin = {
            "aggressive": 0.8,
            "confident": 0.8,
            "focused": 0.5,
            "calm": 0.3,
            "sad": 0.2,
            "neutral": 0.4,
        }.get(mood, 0.4)

        objs.append({
            "id": "obj_character_aura",
            "type": "torus",
            "transform": {"pos": [0, 0.8, 0], "scale": [1.6, 1.6, 1.6]},
            "material": {
                "color": palette["accent"],
                "opacity": 0.35,
                "emissive": palette["accent"],
                "emissiveIntensity": 0.9,
            },
            "tags": ["character", "character_aura"],
        })
        anims.append({"target": "obj_character_aura", "type": "spin", "intensity": aura_spin})

        objs.append({
            "id": "obj_character_emblem",
            "type": "box",
            "transform": {"pos": [0, 2.1, 0], "scale": [0.4, 0.4, 0.4]},
            "material": {"color": palette["primary"], "opacity": 0.9},
            "tags": ["character", "character_emblem"],
        })
        anims.append({"target": "obj_character_emblem", "type": "wobble", "intensity": 0.3})

    if "chaos" in topics:
        scene_json["meta"]["domain"] = "chaos"
        chaos_model = chaos_defaults(user_text)
        scene_json["domain_model"]["chaos"] = chaos_model

        points = []
        for i in range(600):
            px = _pseudo_rand(i, 0.1) * 4 - 2
            py = _pseudo_rand(i, 0.5) * 4 - 2
            pz = _pseudo_rand(i, 0.9) * 4 - 2
            points.append([px, py, pz])

        path = generate_orbit(chaos_model["attractor"], 900, chaos_model["noise"])

        objs.append({
            "id": "obj_chaos_field",
            "type": "points_cloud",
            "transform": {"pos": [0, 0, 0], "scale": [1.0, 1.0, 1.0]},
            "material": {"color": "auto", "opacity": 0.85, "size": 0.03},
            "data": {"points": points},
            "tags": ["chaos", "chaos_field"],
        })
        spin_intensity = 0.2 + clamp01(chaos_model["instability"]) * 0.6
        anims.append({"target": "obj_chaos_field", "type": "spin", "intensity": spin_intensity})

        objs.append({
            "id": "obj_chaos_trail",
            "type": "line_path",
            "transform": {"pos": [0, 0, 0], "scale": [1.0, 1.0, 1.0]},
            "material": {"color": "#22d3ee", "opacity": 0.9},
            "data": {"path": path},
            "tags": ["chaos", "chaos_trail"],
        })

    scene_json["scene"]["objects"] = objs
    scene_json["scene"]["animations"] = anims
    return scene_json
