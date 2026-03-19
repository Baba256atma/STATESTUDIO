from __future__ import annotations

from engines.system_modeling.system_model_builder import UniversalSystemModelBuilder


def test_builder_generates_supply_chain_model():
    builder = UniversalSystemModelBuilder()

    model = builder.build(
        "Supply chain delays are increasing costs and reducing customer satisfaction. "
        "Suppliers are unreliable and inventory shortages create panic orders."
    )

    object_ids = {item.id for item in model.objects}
    signal_ids = {item.id for item in model.signals}

    assert "obj_supplier" in object_ids
    assert "obj_inventory" in object_ids
    assert "sig_cost" in signal_ids
    assert "sig_customer_satisfaction" in signal_ids
    assert any(loop.name == "Supply Pressure Loop" for loop in model.loops)
    assert any(point.signal == "inventory level" for point in model.fragility_points)
    assert model.relationships


def test_builder_generates_startup_competition_conflict():
    builder = UniversalSystemModelBuilder()

    model = builder.build(
        "The startup faces intense competition and rising burn. "
        "Leadership wants growth, but investors worry about stability."
    )

    assert any(item.id == "obj_startup" for item in model.objects)
    assert any(item.id == "obj_competitor" for item in model.objects)
    assert any(conflict.name == "Growth vs Stability" for conflict in model.conflicts)
