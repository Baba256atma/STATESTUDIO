from __future__ import annotations

from app.services.ai.system_modeling_engine import UniversalSystemModelingEngine


def test_system_modeling_engine_builds_expected_supply_chain_model():
    engine = UniversalSystemModelingEngine()

    model = engine.build(
        text=(
            "Supply chain delays are increasing costs and reducing customer satisfaction. "
            "Suppliers are unreliable and inventory shortages create panic orders."
        ),
        context={"domain": "operations"},
        metadata={"task": "model_system"},
    )

    object_ids = {item.id for item in model.objects}
    signal_ids = {item.id for item in model.signals}
    relationship_pairs = {(item.from_object, item.to_object, item.type) for item in model.relationships}

    assert model.problem_summary
    assert "obj_supplier" in object_ids
    assert "obj_inventory" in object_ids
    assert "sig_cost" in signal_ids
    assert "sig_customer_satisfaction" in signal_ids
    assert any(loop.name == "Panic Ordering Loop" for loop in model.loops)
    assert any(point.signal == "inventory level" for point in model.fragility_points)
    assert any(item.signal == "Operational Cost" for item in model.scenario_inputs)
    assert relationship_pairs


def test_system_modeling_engine_falls_back_to_core_system_object():
    engine = UniversalSystemModelingEngine()

    model = engine.build(text="A tightly coupled situation is becoming unstable.")

    assert model.objects[0].id == "obj_system"
